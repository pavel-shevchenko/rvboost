import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDbService } from './user_db.service';
import { AuthModule } from '../auth';
import { MailModule } from '../mail';
import { OrganizationModule } from '../organization';

@Module({
  imports: [
    MailModule,
    forwardRef(() => AuthModule),
    forwardRef(() => OrganizationModule)
  ],
  providers: [UserService, UserDbService],
  exports: [UserService, UserDbService]
})
export class UserModule {}
