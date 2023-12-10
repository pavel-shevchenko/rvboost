import {
  AnyEntity,
  EntityRepository,
  FilterQuery,
  QueryOrderMap,
  RequiredEntityData
} from '@mikro-orm/core';
import { EntityData, ExcludeFunctions } from '@mikro-orm/core/typings';

import { FilterQueryParam, OrderQueryParam, RelationPath } from '../index';
import { EntityFilters, QueryParser } from '../providers';

export interface MikroCrudService<
  Entity extends AnyEntity = AnyEntity,
  CreateDto extends RequiredEntityData<Entity> = RequiredEntityData<Entity>,
  UpdateDto extends EntityData<Entity> = EntityData<Entity>
> {
  readonly repository: EntityRepository<Entity>;
  readonly collectionFields: ExcludeFunctions<Entity, any>[];
  readonly parser: QueryParser<Entity>;
  readonly filters: EntityFilters;

  list({
    limit,
    offset,
    filter,
    filterQueryParam,
    order,
    orderQueryParam,
    expand,
    refresh,
    user
  }: {
    limit?: number;
    offset?: number;
    filter?: FilterQuery<Entity>;
    filterQueryParam?: FilterQueryParam<Entity>[];
    order?: QueryOrderMap<Entity>;
    orderQueryParam?: OrderQueryParam<Entity>[];
    expand?: RelationPath<Entity>[];
    refresh?: boolean;
    user?: any;
  });

  create({ data, user }: { data: CreateDto; user?: any }): Promise<Entity>;

  retrieve({
    conditions,
    expand,
    refresh,
    user
  }: {
    conditions: FilterQuery<Entity>;
    expand?: RelationPath<Entity>[];
    refresh?: boolean;
    user?: any;
  }): Promise<Entity>;

  replace({
    entity,
    data
  }: {
    entity: Entity;
    data: CreateDto;
    user?: any;
  }): Promise<Entity>;

  update({
    entity,
    data
  }: {
    entity: Entity;
    data: UpdateDto;
    user?: any;
  }): Promise<Entity>;

  destroy({ entity }: { entity: Entity; user?: any }): Promise<Entity>;

  exists({
    conditions,
    user
  }: {
    conditions: FilterQuery<Entity>;
    user?: any;
  }): Promise<boolean>;

  save(): Promise<void>;

  /**
   * Mark only the specified relations as populated to shape the JSON response.
   * @param args
   */
  adjustPopulationStatus({
    entity,
    expand
  }: {
    entity: Entity;
    expand?: RelationPath<Entity>[];
  }): Promise<Entity>;
}
