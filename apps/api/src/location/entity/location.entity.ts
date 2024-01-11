import { ILocation } from 'typing';
import { PermissionSubject } from 'casl';
import { BaseEntity } from '../../common/entities/base.entity';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToOne,
  Property
} from '@mikro-orm/core';
import { Organization } from '../../organization/entity';
import { Card } from '../../card/entity';
import { CrudEntityFilter } from '../../common/permissions';

@CrudEntityFilter(PermissionSubject.entityLocation)
@Entity({
  tableName: 'locations'
})
export class Location extends BaseEntity<Location> implements ILocation {
  @Property({ nullable: false })
  name: string;

  @Property({ nullable: false })
  address: string;

  @Property({ nullable: false })
  linkDefault: string;

  @Property({ nullable: true })
  linkGoogle: string;

  @Property({ nullable: true })
  linkTrustPilot: string;

  @ManyToOne(() => Organization)
  organization: Organization;

  @OneToOne(() => Card)
  card: Card;
}
