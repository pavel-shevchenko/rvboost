import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property
} from '@mikro-orm/core';

import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entity';
import { IOrganization, PermissionSubject } from 'typing';
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

  @ManyToMany({ entity: () => User, mappedBy: (user) => user.organizations })
  users = new Collection<User>(this);

  @Property({ persist: false })
  get user() {
    return { id: this.users?.getItems()?.pop()?.id };
  }

  @OneToMany(() => Location, (loc) => loc.organization)
  locations = new Collection<Location>(this);
}
