import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

import { MikroCrudServiceFactory } from '../nestjs-crud';
import { CrudCardDto } from 'validation';
import { Card } from './entity';

class CrudCardDbDto extends CrudCardDto {}

const CRUDService = new MikroCrudServiceFactory({
  entity: Card,
  dto: {
    create: CrudCardDbDto,
    update: PartialType(CrudCardDbDto)
  }
}).product;

@Injectable()
export class CardCrudService extends CRUDService {}
