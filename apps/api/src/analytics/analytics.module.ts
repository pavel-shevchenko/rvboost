import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AnalyticsController } from './analytics.controller';
import { Event } from './entity';
import { EventCrudService } from './event_crud.service';
import { CardModule } from '../card';
import { AnalyticsService } from './analytics.service';
import { UserModule } from '../user';
import { LocationModule } from '../location';
import { ReviewModule } from '../review';
import { EventDbService } from './event_db.service';

@Module({
  imports: [
    UserModule,
    CardModule,
    ReviewModule,
    LocationModule,
    MikroOrmModule.forFeature([Event])
  ],
  providers: [AnalyticsService, EventCrudService, EventDbService],
  controllers: [AnalyticsController],
  exports: [EventCrudService]
})
export class AnalyticsModule {}
