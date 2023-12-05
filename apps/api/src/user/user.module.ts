import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDbService } from './user_db.service';
import { AuthModule } from '../auth';
import { MailModule } from '../mail';
import { OrganizationModule } from '../organization';
import { UserController } from './user.controller';

@Module({
  imports: [
    MailModule,
    forwardRef(() => AuthModule),
    forwardRef(() => OrganizationModule)
  ],
  controllers: [UserController],
  providers: [UserService, UserDbService],
  exports: [UserService, UserDbService]
})
export class UserModule {}
