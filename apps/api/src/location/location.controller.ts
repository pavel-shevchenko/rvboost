import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { LocationCrudService } from './location_crud.service';
import { JwtAuthGuard } from '../auth/guards';

const CRUDController = new MikroCrudControllerFactory<LocationCrudService>({
  service: LocationCrudService,
  actions: ['query', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 },
    order: { in: ['id:desc'], default: ['id:desc'] },
    expand: {
      // @ts-ignore
      in: ['externalFollowedEventsCount', 'reviewsCount', 'avgRating'],
      // @ts-ignore
      default: ['externalFollowedEventsCount', 'reviewsCount', 'avgRating']
    }
  }
}).applyDecoratorToActions(UseGuards(JwtAuthGuard)).product;

@Controller('location')
export class LocationController extends CRUDController {
  constructor() {
    super();
  }
}
