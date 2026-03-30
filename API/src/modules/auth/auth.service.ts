import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { GoogleLoginDto } from './dto/googleLoginDto';
import { OAuth2Client } from 'google-auth-library';
import { AuthUser } from './interfaces/user.interface';
import { RegisterDto } from './dto/registerDto';
import * as bcrypt from 'bcryptjs';
import { AuthSuccessData } from './types';
import { User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user && user.password) {
      const isPasswordValid = await bcrypt.compare(pass, user.password);
      if (isPasswordValid) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...restData } = user;
        return restData;
      }
    }
    return null;
  }

  login(user: AuthUser) {
    const payload = { email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(resgisterData: RegisterDto): Promise<AuthSuccessData> {
    try {
      const { email, password, name } = resgisterData;

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      console.log('Existing user:', existingUser);

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed password:', hashedPassword);

      const user = await this.userService.createUser({
        email: email,
        password: hashedPassword,
        name: name,
      });
      console.log('Created user:', user);

      const payload = {
        email: user.email,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: user,
      };
    } catch (error) {
      console.log('Error during registration:', error);
      throw new InternalServerErrorException(error as Error);
    }
  }

  async google(
    googleLoginDto: GoogleLoginDto,
  ): Promise<AuthSuccessData | undefined> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: googleLoginDto.token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new BadRequestException('Invalid Google token');
      }

      const { email, name, picture } = payload;

      if (email) {
        let user = await this.userService.findUserByEmail(email);

        if (!user) {
          user = await this.userService.createUser({
            email,
            name,
            picture,
          });
        } else {
          if (!user.picture && picture) {
            await this.userService.updateUser(email, { picture });
          }
        }

        const jwtPayload = { email: user.email };
        const accessToken = this.login(jwtPayload);

        return {
          access_token: accessToken.access_token,
          user,
        };
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async validateToken(token: string): Promise<User> {
    try {
      const decoded: { email: string } = this.jwtService.verify(token);
      const user = await this.userService.findUserByEmail(decoded.email);
      if (!user) throw new InternalServerErrorException('Invalid token');
      return user;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
