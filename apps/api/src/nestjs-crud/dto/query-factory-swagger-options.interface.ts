import { AnyEntity, EntityData, RequiredEntityData } from '@mikro-orm/core';
import { Type } from '@nestjs/common';

import { MikroCrudService } from '../service';

export interface QueryFactorySwaggerOptions<
  Entity extends AnyEntity<Entity> = any,
  CreateDto extends RequiredEntityData<Entity> = RequiredEntityData<Entity>,
  UpdateDto extends EntityData<Entity> = EntityData<Entity>,
  Service extends MikroCrudService<
    Entity,
    CreateDto,
    UpdateDto
  > = MikroCrudService<Entity, CreateDto, UpdateDto>,
> {
  service: Type<Service>;
}
