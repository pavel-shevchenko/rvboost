import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { ReviewCrudService } from './review_crud.service';
import { JwtAuthGuard } from '../auth/guards';

const CRUDController = new MikroCrudControllerFactory<ReviewCrudService>({
  service: ReviewCrudService,
  actions: ['query', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 }
  }
}).applyDecoratorToActions(UseGuards(JwtAuthGuard)).product;

@Controller('review')
export class ReviewController extends CRUDController {
  constructor() {
    super();
  }
}
