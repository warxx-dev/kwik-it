import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LinkModule } from '../link/link.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => LinkModule)],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
