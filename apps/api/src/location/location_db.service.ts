import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { NewClientCompany } from 'validation';
import { Location } from './entity';
import { Organization } from '../organization/entity';

@Injectable()
export class LocationDbService {
  constructor(private readonly em: EntityManager) {}

  async createNewLocation(
    organization: Organization,
    companyData: NewClientCompany
  ) {
    const location = this.em.create<Location>(Location, {
      organization,
      name: companyData.companyName,
      address: companyData.companyAddress,
      linkDefault: companyData.companyLinkDefault,
      linkGoogle: companyData.companyLinkGoogle,
      linkTrustPilot: companyData.companyLinkTrustPilot
    });
    await this.em.persistAndFlush([location]);

    return location;
  }
}
