import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { User } from '../../user/entity';
import { Organization } from './organization.entity';
import { UserRoleInOrgType } from 'typing';

@Entity({
  tableName: 'user_role_in_org_pivot'
})
export class UserRoleInOrganization {
  @ManyToOne({ entity: () => User, primary: true })
  user: User;

  @ManyToOne({ entity: () => Organization, primary: true })
  organization: Organization;

  @Property()
  role: UserRoleInOrgType;
}
