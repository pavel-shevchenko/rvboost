import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { UserService } from '../user';
import { User } from '../user/entity';
import { OrganizationDbService } from './organization_db.service';
import { NewClientDto } from 'validation';
import { LocationCrudService } from '../location';
import { Location } from '../location/entity';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly orgDbService: OrganizationDbService,
    private readonly locationCrudService: LocationCrudService
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

    const locationsPromises: Array<Promise<Location>> = [];
    for (const companyData of newClientDto.companies) {
      locationsPromises.push(
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
        })
      );
    }
    return await Promise.all(locationsPromises);
  }
}
