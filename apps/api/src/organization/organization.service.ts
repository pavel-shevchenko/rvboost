import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common';

import { UserService } from '../user';
import { User } from '../user/entity';
import { OrganizationDbService } from './organization_db.service';
import { NewClientDto, StartClientDto } from 'validation';
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

  async getOrganizationByClient(client: User) {
    const organizations =
      await this.orgDbService.getOrganizationsByClient(client);
    if (!organizations.length) throw new ForbiddenException();

    return organizations[0];
  }

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

  async startClient(client: User, startClientDto: StartClientDto) {
    let isAssignedToOrg: boolean;
    try {
      await this.getOrganizationByClient(client);
      isAssignedToOrg = true;
    } catch (e) {
      isAssignedToOrg = false;
    }
    if (isAssignedToOrg) throw new ForbiddenException();

    const orgAndCompanyName = startClientDto.orgName;
    const organization = await this.orgDbService.newOrganizationForClient(
      client,
      orgAndCompanyName
    );

    const locationsPromises: Array<Promise<Location>> = [];
    for (const companyData of startClientDto.companies) {
      locationsPromises.push(
        this.locationCrudService.create({
          user: client,
          data: {
            organization: organization.id,
            name: orgAndCompanyName,
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
