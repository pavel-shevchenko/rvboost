import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from '../user';
import { AuthModule } from '../auth';
import { MikroCrudModule } from '../nestjs-crud';
import { CrudEntityFilterContext } from '../common/typing';
import { OrganizationModule } from '../organization';
import { SubscriptionModule } from '../subscription';
import { LocationModule } from '../location';
import { CardModule } from '../card';
import { ReviewModule } from '../review';
import { MinioModule } from '../minio';
import { LinkShorterModule } from '../link-shorter';
import { AnalyticsModule } from '../analytics';
import { PromocodeModule } from '../promocode';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    {
      ...MikroCrudModule.configure({
        filters: (entityFilterContext: CrudEntityFilterContext) => {
          return { crudEntityFilter: entityFilterContext }; // `efCtx` via filter parameters
        }
      }),
      global: true
    },
    UserModule,
    AuthModule,
    OrganizationModule,
    SubscriptionModule,
    PromocodeModule,
    LocationModule,
    CardModule,
    MinioModule,
    ReviewModule,
    AnalyticsModule,
    LinkShorterModule
  ]
})
export class AppModule {}
