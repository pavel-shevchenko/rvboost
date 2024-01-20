import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { EntityManager } from '@mikro-orm/postgresql';

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
  constructor(
    private readonly cardCrudService: CardCrudService,
    private readonly em: EntityManager
  ) {
    super();
  }

  async create({ data, user }: { data: CrudLocationDbDto; user: User }) {
    const location = await super.create({ data, user });

    await this.cardCrudService.create({ user, data: { location: location.id } });

    return this.em.refresh(location, { populate: ['card'] });
  }
}
