import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDbService } from './user_db.service';
import { AuthModule } from '../auth';
import { MailModule } from '../mail';
import { OrganizationModule } from '../organization';
import { UserController } from './user.controller';
import { MikroCrudModule } from '../nestjs-crud';
import { UserCrudService } from './user_crud.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entity';

@Module({
  imports: [
    MikroCrudModule,
    MikroOrmModule.forFeature([User]),
    MailModule,
    forwardRef(() => AuthModule),
    forwardRef(() => OrganizationModule)
  ],
  controllers: [UserController],
  providers: [UserService, UserDbService, UserCrudService],
  exports: [UserService, UserDbService]
})
export class UserModule {}
