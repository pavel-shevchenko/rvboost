import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AnalyticsController } from './analytics.controller';
import { Event } from './entity';
import { EventCrudService } from './event_crud.service';
import { CardModule } from '../card';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [CardModule, MikroOrmModule.forFeature([Event])],
  providers: [AnalyticsService, EventCrudService],
  controllers: [AnalyticsController],
  exports: [EventCrudService]
})
export class AnalyticsModule {}
