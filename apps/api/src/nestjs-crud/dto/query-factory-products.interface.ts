import { AnyEntity } from '@mikro-orm/core';

import { QueryDto } from './query-dto.interface';
import { QueryParams } from './query-params.interface';

export interface QueryFactoryProducts<Entity extends AnyEntity<Entity> = any> {
  queryParams: QueryParams<Entity>;
  queryDto: QueryDto<Entity>;
}
