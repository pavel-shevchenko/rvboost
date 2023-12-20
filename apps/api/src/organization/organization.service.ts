import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user';
import { OrganizationDbService } from './organization_db.service';
import { User } from '../user/entity';
import { NewClientDto } from 'validation';
import { LocationDbService } from '../location/location_db.service';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private orgDbService: OrganizationDbService,
    private locationDbService: LocationDbService
  ) {}

  async newClient(admin: User, newClientDto: NewClientDto) {
    const client = await this.userService.createUser(
      newClientDto.clientEmail,
      newClientDto.clientPassword,
      newClientDto.clientName
    );
    const organization = await this.orgDbService.newOrganizationForClient(
      client,
      newClientDto.orgName
    );
    for (const companyData of newClientDto.companies) {
      await this.locationDbService.createNewLocation(organization, companyData);
    }
  }
}
