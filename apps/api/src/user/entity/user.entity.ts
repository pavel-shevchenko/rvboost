import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
  Unique
} from '@mikro-orm/core';
import { IUser } from 'typing';
import { PermissionSubject } from 'casl';

import { BaseEntity } from '../../common/entities/base.entity';
import { Organization, UserRoleInOrganization } from '../../organization/entity';
import { CrudEntityFilter } from '../../common/permissions';
import { UserSocialAuth } from '../../auth/entity';

@CrudEntityFilter(PermissionSubject.entityUser)
@Entity({
  tableName: 'users'
})
export class User extends BaseEntity<User> implements IUser {
  @Unique()
  @Property()
  email: string;

  @Property({ hidden: true, nullable: true })
  passwordHash?: string;

  @Property({ hidden: true, nullable: true })
  passwordResetToken: string;

  @OneToMany(() => UserSocialAuth, (socAuth) => socAuth.user, {
    cascade: [Cascade.REMOVE]
  })
  socialAuths: UserSocialAuth[];

  @Property({ nullable: true })
  username: string;

  @ManyToMany({
    entity: () => Organization,
    pivotEntity: () => UserRoleInOrganization
  })
  organizations = new Collection<Organization>(this);

  @Property({ default: false })
  isAdmin: boolean;

  @Property({ nullable: true })
  promoRegedCode: string;

  @Property({ nullable: true })
  promoRegedCountry: string;

  @Property({ nullable: true })
  promoRegedCity: string;

  @Property({ nullable: true })
  promoRegedAddress: string;

  @Property({ nullable: true })
  promoRegedZip: string;

  @Property({ nullable: true })
  promoRegedName: string;

  @Property({ nullable: true })
  promoRegedSurname: string;

  @Property({ nullable: true })
  promoRegedPhone: string;
}
