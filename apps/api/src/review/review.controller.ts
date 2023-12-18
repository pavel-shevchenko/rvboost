import { Controller } from '@nestjs/common';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { ReviewCrudService } from './review_crud.service';

const CRUDController = new MikroCrudControllerFactory<ReviewCrudService>({
  service: ReviewCrudService,
  actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 }
  }
}).product;

@Controller('review')
export class ReviewController extends CRUDController {
  constructor() {
    super();
  }
}
