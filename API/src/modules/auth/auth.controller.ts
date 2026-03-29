import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import * as express from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerDto';
import { GoogleLoginDto } from './dto/googleLoginDto';
import { type AuthRequest } from './interfaces/auth.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Cookies } from '../../decorators/cookies.decorator';
import { User } from 'src/generated/prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { access_token } = this.authService.login(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { access_token };
  }

  @Post('register')
  async register(
    @Body() registerData: RegisterDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.register(registerData);
    if (result) {
      res.cookie('access_token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return result;
    }
  }

  @Post('google')
  async google(
    @Body() googleLoginData: GoogleLoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.google(googleLoginData);

    if (result)
      res.cookie('access_token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    return result;
  }

  @Get('me')
  async me(
    @Cookies() cookies: Record<string, string | undefined>,
  ): Promise<User | null> {
    const token = cookies['access_token'];
    if (!token || typeof token !== 'string') {
      return null;
    }
    const user = await this.authService.validateToken(token);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return { message: 'Logged out successfully' };
  }
}
