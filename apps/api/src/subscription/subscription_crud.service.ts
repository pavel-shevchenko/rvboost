import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

import { MikroCrudServiceFactory } from '../nestjs-crud';
import { CrudSubscriptionDto } from 'validation';
import { Subscription } from './entity';

class CrudSubscriptionDbDto extends CrudSubscriptionDto {}

const CRUDService = new MikroCrudServiceFactory({
  entity: Subscription,
  dto: {
    create: CrudSubscriptionDbDto,
    update: PartialType(CrudSubscriptionDbDto)
  }
}).product;

@Injectable()
export class SubscriptionCrudService extends CRUDService {}
