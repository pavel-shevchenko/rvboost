import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { UserService } from '../user';
import { User } from '../user/entity';
import { OrganizationDbService } from './organization_db.service';
import { NewClientDto } from 'validation';
import { LocationDbService } from '../location';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private orgDbService: OrganizationDbService,
    private locationDbService: LocationDbService
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
      await this.locationDbService.createNewLocation(organization, companyData);
    }
  }
}
