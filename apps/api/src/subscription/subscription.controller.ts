import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { SubscriptionCrudService } from './subscription_crud.service';
import { JwtAuthGuard } from '../auth/guards';

const CRUDController = new MikroCrudControllerFactory<SubscriptionCrudService>({
  service: SubscriptionCrudService,
  actions: ['query', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 }
  }
}).applyDecoratorToActions(UseGuards(JwtAuthGuard)).product;

@Controller('subscription')
export class SubscriptionController extends CRUDController {
  constructor() {
    super();
  }
}
