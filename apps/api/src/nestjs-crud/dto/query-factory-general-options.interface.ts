import { FilterQuery, QueryOrderMap } from '@mikro-orm/core';

import {
  FilterQueryParam,
  OrderQueryParam,
  RelationPath,
  ScalarPath,
} from '../types';

export interface QueryFactoryGeneralOptions<Entity> {
  limit?: {
    max?: number;
    default?: number;
  };
  offset?: {
    max?: number;
    default?: number;
  };
  order?: {
    in: (OrderQueryParam<Entity> | ScalarPath<Entity>)[];
    default?: OrderQueryParam<Entity>[] | QueryOrderMap<Entity>;
  };
  filter?: {
    in: ScalarPath<Entity>[];
    default?: FilterQueryParam<Entity>[] | FilterQuery<Entity>;
  };
  expand?: {
    in: RelationPath<Entity>[];
    default?: RelationPath<Entity>[];
  };
}
