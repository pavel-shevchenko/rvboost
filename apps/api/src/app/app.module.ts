import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from '../user';
import { AuthModule } from '../auth';
import { AppController } from './add.controller';
import { MikroCrudModule } from '../nestjs-crud';
import { CrudEntityFilterContext } from '../common/typing';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    {
      ...MikroCrudModule.configure({
        filters: ({ user }: CrudEntityFilterContext) => {
          return { roleScopes: { user } };
        }
      }),
      global: true
    },
    UserModule,
    AuthModule
  ],
  controllers: [AppController]
})
export class AppModule {}
