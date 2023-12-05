import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { IUser } from 'typing';

import { BaseEntity } from '../../common/entities';
import { Organization, UserRoleInOrganization } from '../../organization/entity';

@Entity({
  tableName: 'users'
})
export class User extends BaseEntity<User> implements IUser {
  @Property()
  email: string;

  @Property({ hidden: true })
  passwordHash: string;

  @Property({ hidden: true, nullable: true })
  passwordResetToken: string;

  @Property({ nullable: true })
  username: string;

  @ManyToMany({
    entity: () => Organization,
    pivotEntity: () => UserRoleInOrganization
  })
  organizations = new Collection<Organization>(this);
}
