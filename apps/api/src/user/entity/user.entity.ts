import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { IUser } from 'typing';
import { Organization } from '../../organization/entity/organization.entity';
import { UserRoleInOrganization } from '../../organization/entity/user-role-in-org.entity';

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
