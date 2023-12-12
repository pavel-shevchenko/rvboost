import { ILocation } from 'typing';
import { BaseEntity } from '../../common/entities/base.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Organization } from '../../organization/entity';

@Entity({
  tableName: 'locations'
})
export class Location extends BaseEntity<Location> implements ILocation {
  @Property()
  name: string;

  @Property()
  address: string;

  @Property()
  linkDefault: string;

  @Property()
  linkGoogle: string;

  @Property()
  linkTrustPilot: string;

  @ManyToOne(() => Organization)
  organization: Organization;
}
