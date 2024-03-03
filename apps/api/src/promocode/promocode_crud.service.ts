import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

import { MikroCrudServiceFactory } from '../nestjs-crud';
import { CrudPromocodeDto } from 'validation';
import { Promocode } from './entity';

class CrudPromocodeDbDto extends CrudPromocodeDto {}

const CRUDService = new MikroCrudServiceFactory({
  entity: Promocode,
  dto: {
    create: CrudPromocodeDbDto,
    update: PartialType(CrudPromocodeDbDto)
  }
}).product;

@Injectable()
export class PromocodeCrudService extends CRUDService {}
