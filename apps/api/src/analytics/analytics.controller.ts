import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { JwtAuthGuard } from '../auth/guards';
import { EventCrudService } from './event_crud.service';

const EventCrudController = new MikroCrudControllerFactory<EventCrudService>({
  service: EventCrudService,
  actions: ['query', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 },
    order: { in: ['createdAt:desc'], default: ['createdAt:desc'] }
  }
}).applyDecoratorToActions(UseGuards(JwtAuthGuard)).product;

@Controller('analytics')
export class AnalyticsController extends EventCrudController {
  constructor() {
    super();
  }
}
