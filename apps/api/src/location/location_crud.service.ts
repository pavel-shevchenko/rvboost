import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

import { MikroCrudServiceFactory } from '../nestjs-crud';
import { CrudLocationDto } from 'validation';
import { Location } from './entity';

class CrudLocationDbDto extends CrudLocationDto {}

const CRUDService = new MikroCrudServiceFactory({
  entity: Location,
  dto: {
    create: CrudLocationDbDto,
    update: PartialType(CrudLocationDbDto)
  }
}).product;

@Injectable()
export class LocationCrudService extends CRUDService {}
