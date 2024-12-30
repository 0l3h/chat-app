import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(phoneNumber: string): Promise<User | undefined> {
    // return this.users.find(user => user.username === username);
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });
    return user;
  }
}
