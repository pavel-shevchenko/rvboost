import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserRoleInOrgEnum, UserRoleInOrgType } from 'typing';
import { Organization, UserRoleInOrganization } from './entity';
import { User } from '../user/entity';
import { PopulateHint } from '@mikro-orm/core';

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

  async getOrgWithFbSettingsById(id: number) {
    return this.em.findOne(
      Organization,
      { id },
      { populate: ['feedbackSettings'] }
    );
  }

  async getOrganizationsByOwner(user: User) {
    return this.getOrganizationsByUserAndRole(user, UserRoleInOrgEnum.owner);
  }

  async getOrganizationsByClient(user: User) {
    return this.getOrganizationsByUserAndRole(user, UserRoleInOrgEnum.client);
  }

  async getOrganizationsByUserAndRole(user: User, role: UserRoleInOrgType) {
    const pivots = await this.em.find<UserRoleInOrganization>(
      UserRoleInOrganization,
      { user, role }
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

  populatedOrgByShortLinkCode(shortLinkCode: string) {
    return this.em.findOne(
      Organization,
      {
        locations: {
          card: {
            shortLinkCode
          }
        }
      },
      {
        populate: [
          'users',
          'locations.card',
          'feedbackSettings',
          'subscriptions'
        ],
        populateWhere: PopulateHint.INFER
      }
    );
  }
}
