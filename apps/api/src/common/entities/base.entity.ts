import { PrimaryKey, Property, OptionalProps } from '@mikro-orm/core';

type BaseEntityOptional = 'createdAt' | 'updatedAt';

export abstract class BaseEntity<
  T extends BaseEntity<T, any>,
  Optional extends keyof T = never
> {
  @PrimaryKey()
  id!: number;

  @Property({
    comment: 'Entity creation date'
  })
  createdAt: Date = new Date();

  @Property({
    comment: 'Last edit date. Updated automatically on any change',
    onUpdate: () => new Date()
  })
  updatedAt: Date = new Date();

  @Property({
    comment: 'Entity should be considered as soft-deleted if this date is not null',
    nullable: true
  })
  deletedAt?: Date;

  [OptionalProps]?: BaseEntityOptional | Optional;
}
