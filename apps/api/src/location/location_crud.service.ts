import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

import { MikroCrudServiceFactory } from '../nestjs-crud';
import { CrudLocationDto } from 'validation';
import { Location } from './entity';
import { User } from '../user/entity';
import { CardCrudService } from '../card';

class CrudLocationDbDto extends CrudLocationDto {}

const CRUDService = new MikroCrudServiceFactory({
  entity: Location,
  dto: {
    create: CrudLocationDbDto,
    update: PartialType(CrudLocationDbDto)
  }
}).product;

@Injectable()
export class LocationCrudService extends CRUDService {
  constructor(private readonly cardCrudService: CardCrudService) {
    super();
  }

  async create({ data, user }: { data: CrudLocationDbDto; user: User }) {
    const location = await super.create({ data, user });

    location.card = await this.cardCrudService.create({
      user,
      data: { location: location.id }
    });

    return location;
  }
}
