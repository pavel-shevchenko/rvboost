import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { PromocodeCrudService } from './promocode_crud.service';
import { JwtAuthGuard } from '../auth/guards';

const CRUDController = new MikroCrudControllerFactory<PromocodeCrudService>({
  service: PromocodeCrudService,
  actions: ['query', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 }
  }
}).applyDecoratorToActions(UseGuards(JwtAuthGuard)).product;

@Controller('promocodes')
export class PromocodeController extends CRUDController {
  constructor() {
    super();
  }
}
