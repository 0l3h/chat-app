import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() body: { phoneNumber: string; password: string }) {
    return this.authService.signIn(body.phoneNumber, body.password);
  }

  @Post('signup')
  async signup(
    @Body() body: { username: string; phoneNumber: string; password: string },
  ) {
    return this.authService.signup(
      body.phoneNumber,
      body.password,
      body.username,
    );
  }
}
