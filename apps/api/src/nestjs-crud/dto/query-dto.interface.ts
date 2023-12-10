import { AnyEntity, FilterQuery, QueryOrderMap } from '@mikro-orm/core';

import { RelationPath } from '../types';

export interface QueryDto<Entity extends AnyEntity<Entity> = any> {
  limit?: number;
  offset?: number;
  order?: QueryOrderMap<Entity>;
  filter?: FilterQuery<Entity>;
  expand?: RelationPath<Entity>[];
}
