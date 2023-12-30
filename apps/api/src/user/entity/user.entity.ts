import {
  Collection,
  Entity,
  ManyToMany,
  Property,
  Unique
} from '@mikro-orm/core';
import { IUser, PermissionSubject } from 'typing';

import { BaseEntity } from '../../common/entities/base.entity';
import { Organization, UserRoleInOrganization } from '../../organization/entity';
import { CrudEntityFilter } from '../../common/permissions';

@CrudEntityFilter(PermissionSubject.entityUser)
@Entity({
  tableName: 'users'
})
export class User extends BaseEntity<User> implements IUser {
  @Unique()
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

  @Property({ default: false })
  isAdmin: boolean;
}
