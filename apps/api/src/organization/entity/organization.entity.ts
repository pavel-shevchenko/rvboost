import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entity';

@Entity({
  tableName: 'organizations'
})
export class Organization extends BaseEntity<Organization> {
  @Property()
  name: string;

  @ManyToMany({ entity: () => User, mappedBy: (user) => user.organizations })
  users = new Collection<User>(this);
}
