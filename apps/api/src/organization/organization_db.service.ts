import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserRoleInOrgEnum } from 'typing';
import { Organization, UserRoleInOrganization } from './entity';
import { User } from '../user/entity';

@Injectable()
export class OrganizationDbService {
  constructor(private readonly em: EntityManager) {}

  async newOrganizationForClient(client: User, organizationName: string) {
    const organization = this.em.create<Organization>(Organization, {
      name: organizationName
    });
    const pivot = this.em.create<UserRoleInOrganization>(UserRoleInOrganization, {
      user: client,
      organization,
      role: UserRoleInOrgEnum.client
    });
    await this.em.persistAndFlush([organization, pivot]);

    return organization;
  }

  async newOwnedOrganization(user: User, organizationName: string) {
    const organization = this.em.create<Organization>(Organization, {
      name: organizationName
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

  async addClientToOrg(user: User, organization: Organization) {
    const pivot = this.em.create<UserRoleInOrganization>(UserRoleInOrganization, {
      user,
      organization,
      role: UserRoleInOrgEnum.client
    });
    await this.em.persistAndFlush([organization, pivot]);

    return organization;
  }

  async delClientsFromOrg(organization: Organization) {
    const pivots = await this.em.find(UserRoleInOrganization, {
      organization,
      role: UserRoleInOrgEnum.client
    });
    return this.em.remove(pivots);
  }
}
