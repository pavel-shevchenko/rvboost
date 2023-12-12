import { Controller } from '@nestjs/common';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { LocationCrudService } from './location_crud.service';

const CRUDController = new MikroCrudControllerFactory<LocationCrudService>({
  service: LocationCrudService,
  actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 }
  }
}).product;

@Controller('location')
export class LocationController extends CRUDController {
  constructor() {
    super();
  }
}
