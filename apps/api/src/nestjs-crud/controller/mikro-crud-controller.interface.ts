import { AnyEntity, EntityData, RequiredEntityData } from '@mikro-orm/core';

import { QueryParams } from '../dto';
import { QueryDto } from '../dto/query-dto.interface';
import { MikroCrudService } from '../service';
import { LookupableField } from '../types';

export interface MikroCrudController<
  Entity extends AnyEntity<Entity> = any,
  CreateDto extends RequiredEntityData<Entity> = RequiredEntityData<Entity>,
  UpdateDto extends EntityData<Entity> = EntityData<Entity>,
  LookupField extends LookupableField<Entity> = any,
  Service extends MikroCrudService<
    Entity,
    CreateDto,
    UpdateDto
  > = MikroCrudService<Entity, CreateDto, UpdateDto>,
> {
  readonly service: Service;
  readonly lookupField: LookupField;

  query(
    { limit, offset, order, filter, expand }: QueryParams<Entity>,
    queryDto: QueryDto<Entity>,
    user: any,
  ): Promise<unknown>;

  create(
    { expand }: QueryParams<Entity>,
    data: CreateDto,
    user: any,
  ): Promise<unknown>;

  retrieve(
    lookup: Entity[LookupField],
    { expand }: QueryParams<Entity>,
    user: any,
  ): Promise<unknown>;

  replace(
    lookup: Entity[LookupField],
    { expand }: QueryParams<Entity>,
    data: CreateDto,
    user: any,
  ): Promise<unknown>;

  update(
    lookup: Entity[LookupField],
    { expand }: QueryParams<Entity>,
    data: UpdateDto,
    user: any,
  ): Promise<unknown>;

  destroy(lookup: Entity[LookupField], user: any): Promise<unknown>;
}
