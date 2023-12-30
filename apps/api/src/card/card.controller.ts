import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { CardCrudService } from './card_crud.service';
import { JwtAuthGuard } from '../auth/guards';

const CRUDController = new MikroCrudControllerFactory<CardCrudService>({
  service: CardCrudService,
  actions: ['query', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 }
  }
}).applyDecoratorToActions(UseGuards(JwtAuthGuard)).product;

@Controller('card')
export class CardController extends CRUDController {
  constructor() {
    super();
  }
}
