import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signIn(
    phoneNumber: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNumber,
      },
    });

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      username: user.name,
    };

    return {
      ...payload,
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('AUTH_SECRET'),
      }),
    };
  }

  async signup(
    phoneNumber: string,
    password: string,
    username: string,
  ): Promise<{ name: string; phoneNumber: string }> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = await this.prismaService.user.create({
      data: {
        name: username,
        phoneNumber,
        password: hashedPassword,
      },
    });
    return userData;
  }
}
