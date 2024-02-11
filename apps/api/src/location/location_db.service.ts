import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { Location } from './entity';

@Injectable()
export class LocationDbService {
  constructor(private readonly em: EntityManager) {}

  getAllLocationsCount() {
    return this.em.count(Location);
  }
}
