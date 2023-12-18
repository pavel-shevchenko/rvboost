import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

import { MikroCrudServiceFactory } from '../nestjs-crud';
import { CrudReviewDto } from 'validation';
import { Review } from './entity';

class CrudReviewDbDto extends CrudReviewDto {}

const CRUDService = new MikroCrudServiceFactory({
  entity: Review,
  dto: {
    create: CrudReviewDbDto,
    update: PartialType(CrudReviewDbDto)
  }
}).product;

@Injectable()
export class ReviewCrudService extends CRUDService {}
