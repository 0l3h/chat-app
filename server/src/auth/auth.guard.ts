import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient();
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      this.jwtService.verifyAsync(token, {
        secret: this.configService.get('AUTH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
