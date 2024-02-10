import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AnalyticsController } from './analytics.controller';
import { Event } from './entity';
import { EventCrudService } from './event_crud.service';

@Module({
  imports: [MikroOrmModule.forFeature([Event])],
  providers: [EventCrudService],
  controllers: [AnalyticsController],
  exports: [EventCrudService]
})
export class AnalyticsModule {}
