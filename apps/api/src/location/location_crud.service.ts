import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { EntityManager } from '@mikro-orm/postgresql';
import { FilterQuery } from '@mikro-orm/core';

import { MikroCrudServiceFactory, RelationPath } from '../nestjs-crud';
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

  async retrieve({
    conditions = {} as FilterQuery<Location>,
    expand = [],
    refresh,
    user
  }: {
    conditions: FilterQuery<Location>;
    expand?: RelationPath<Location>[];
    refresh?: boolean;
    user?: any;
  }): Promise<Location> {
    return super.retrieve({
      conditions,
      expand: [
        // @ts-ignore
        ...expand,
        // @ts-ignore
        'reviewsCountLast30days',
        // @ts-ignore
        'externalFollowEventsCntLast30days',
        // @ts-ignore
        'showRatingFormEventsCntLast30days',
        // @ts-ignore
        'showPlatformFormEventsCntLast30days',
        // @ts-ignore
        'showBadFormEventsCntLast30days',
        // @ts-ignore
        'submitBadFormEventsCntLast30days'
      ],
      refresh,
      user
    });
  }
}
