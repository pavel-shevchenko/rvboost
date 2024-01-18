import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { UserService } from '../user';
import { User } from '../user/entity';
import { OrganizationDbService } from './organization_db.service';
import { NewClientDto } from 'validation';
import { LocationCrudService } from '../location';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private orgDbService: OrganizationDbService,
    private locationCrudService: LocationCrudService
  ) {}

  async newClient(admin: User, newClientDto: NewClientDto) {
    const client = await this.userService.createUser({
      email: newClientDto.clientEmail,
      password: newClientDto.clientPassword,
      username: newClientDto.clientName
    });
    const organization = await this.orgDbService.newOrganizationForClient(
      client,
      newClientDto.orgName
    );
    for (const companyData of newClientDto.companies) {
      this.locationCrudService.create({
        user: admin,
        data: {
          organization: organization.id,
          name: companyData.companyName,
          address: companyData.companyAddress,
          linkDefault: companyData.companyLinkDefault,
          linkGoogle: companyData.companyLinkGoogle,
          linkTrustPilot: companyData.companyLinkTrustPilot
        }
      });
    }
  }
}
