import { ISubscription } from 'typing';
import { PermissionSubject } from 'casl';
import { BaseEntity } from '../../common/entities/base.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Organization } from '../../organization/entity';
import { CrudEntityFilter } from '../../common/permissions';

@CrudEntityFilter(PermissionSubject.entitySubscription)
@Entity({
  tableName: 'subscriptions'
})
export class Subscription
  extends BaseEntity<Subscription>
  implements ISubscription
{
  @Property({ nullable: false })
  validUntil: Date;

  @Property()
  locationsCnt: number;

  @ManyToOne(() => Organization)
  organization: Organization;
}
