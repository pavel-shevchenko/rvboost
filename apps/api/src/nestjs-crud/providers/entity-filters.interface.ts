import { FindOptions } from '@mikro-orm/core';

export interface EntityFilterContext {
  user: any;
}

export interface EntityFilters {
  ({ user }: EntityFilterContext): FindOptions<never>['filters'];
}
