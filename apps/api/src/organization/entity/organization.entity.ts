import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';

import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entity';
import { IOrganization } from 'typing';

@Entity({
  tableName: 'organizations'
})
export class Organization
  extends BaseEntity<Organization>
  implements IOrganization
{
  @Property()
  name: string;

  @ManyToMany({ entity: () => User, mappedBy: (user) => user.organizations })
  users = new Collection<User>(this);

  @Property({ persist: false })
  get user() {
    return { id: this.users?.getItems()?.pop()?.id };
  }
}
