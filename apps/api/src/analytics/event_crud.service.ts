import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

import { Event } from './entity';
import { MikroCrudServiceFactory } from '../nestjs-crud';
import { CrudEventDto } from 'validation';

class CrudEventDbDto extends CrudEventDto {}

const CRUDService = new MikroCrudServiceFactory({
  entity: Event,
  dto: {
    create: CrudEventDbDto,
    update: PartialType(CrudEventDbDto)
  }
}).product;

@Injectable()
export class EventCrudService extends CRUDService {
  constructor() {
    super();
  }
}
