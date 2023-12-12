import { Controller } from '@nestjs/common';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { CardCrudService } from './card_crud.service';

const CRUDController = new MikroCrudControllerFactory<CardCrudService>({
  service: CardCrudService,
  actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 }
  }
}).product;

@Controller('card')
export class CardController extends CRUDController {
  constructor() {
    super();
  }
}
