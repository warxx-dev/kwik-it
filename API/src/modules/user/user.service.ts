import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from 'src/generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser)
        throw new ConflictException('User with this email already exists');

      const newUser = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error as Error);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new InternalServerErrorException(error as Error);
    }
  }

  async updateUser(
    email: string,
    updateData: Prisma.UserUpdateInput,
  ): Promise<User> {
    try {
      const userToUpdate = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!userToUpdate) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      await this.prisma.user.update({
        where: { email },
        data: updateData,
      });

      const userUpdated = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!userUpdated) {
        throw new InternalServerErrorException(
          'Updated user could not be retrieved',
        );
      }

      return userUpdated;
    } catch (error) {
      throw new InternalServerErrorException(error as Error);
    }
  }

  async removeUser(email: string): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      await this.prisma.user.delete({
        where: { email },
      });

      const deletedUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (deletedUser)
        throw new InternalServerErrorException(
          'Error occurred while deleting user',
        );

      return 'User deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException(error as Error);
    }
  }
}
