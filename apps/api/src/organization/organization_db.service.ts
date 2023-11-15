import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserRoleInOrgEnum } from 'typing';
import { Organization, UserRoleInOrganization } from './entity';
import { User } from '../user/entity';

@Injectable()
export class OrganizationDbService {
  constructor(private readonly em: EntityManager) {}

  async newOwnedOrganization(user: User, name: string) {
    const organization = await this.em.create<Organization>(Organization, {
      name
    });
    const pivot = this.em.create<UserRoleInOrganization>(UserRoleInOrganization, {
      user,
      organization,
      role: UserRoleInOrgEnum.owner
    });
    await this.em.persistAndFlush([organization, pivot]);

    return organization;
  }

  async getOwnedOrganizations(user: User) {
    const pivots = await this.em.find<UserRoleInOrganization>(
      UserRoleInOrganization,
      { user, role: UserRoleInOrgEnum.owner }
    );
    if (!pivots.length) return [];

    return this.em.find<Organization>(
      Organization,
      pivots.map((pivot) => pivot.organization.id)
    );
  }
}
