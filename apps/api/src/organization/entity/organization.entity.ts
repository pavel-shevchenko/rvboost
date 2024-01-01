import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property
} from '@mikro-orm/core';

import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entity';
import { IOrganization } from 'typing';
import { PermissionSubject } from 'casl';
import { Subscription } from '../../subscription/entity';
import { Location } from '../../location/entity';
import { CrudEntityFilter } from '../../common/permissions';

@CrudEntityFilter(PermissionSubject.entityOrganization)
@Entity({
  tableName: 'organizations'
})
export class Organization
  extends BaseEntity<Organization>
  implements IOrganization
{
  @Property({ nullable: false })
  name: string;

  @ManyToMany({
    hidden: true,
    entity: () => User,
    mappedBy: (user) => user.organizations
  })
  users = new Collection<User>(this);

  @Property({ persist: false })
  get user() {
    return { id: this?.users?.getItems()?.pop()?.id };
  }

  @OneToMany(() => Subscription, (subscr) => subscr.organization)
  subscriptions = new Collection<Subscription>(this);

  @OneToMany(() => Location, (loc) => loc.organization)
  locations = new Collection<Location>(this);
}
