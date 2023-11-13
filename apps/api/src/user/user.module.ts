import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDbService } from './user_db.service';
import { AuthModule } from '../auth';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [UserService, UserDbService],
  exports: [UserService, UserDbService]
})
export class UserModule {}
