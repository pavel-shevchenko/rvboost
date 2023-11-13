import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from '../user';
import { AuthModule } from '../auth';
import { AppController } from './add.controller';

@Module({
  imports: [MikroOrmModule.forRoot(), UserModule, AuthModule],
  controllers: [AppController]
})
export class AppModule {}
