import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

import { CrudOrganizationDto } from 'validation';
import { MikroCrudServiceFactory } from '../nestjs-crud';
import { Organization } from './entity';
import { User } from '../user/entity';
import { UserDbService } from '../user';
import { OrganizationDbService } from './organization_db.service';

class CrudOrganizationDbDto extends CrudOrganizationDto {}

const CRUDService = new MikroCrudServiceFactory({
  entity: Organization,
  dto: {
    create: CrudOrganizationDbDto,
    update: PartialType(CrudOrganizationDbDto)
  }
}).product;

@Injectable()
export class OrganizationCrudService extends CRUDService {
  constructor(
    @Inject(forwardRef(() => UserDbService))
    private userDbService: UserDbService,
    private orgDbService: OrganizationDbService
  ) {
    super();
  }

  async create({ data, user }: { data: CrudOrganizationDbDto; user: User }) {
    const newEntity = await super.create({
      data: { ...data },
      user
    });
    await this.putClientToOrg(newEntity, data.user.id);

    return newEntity;
  }

  async update({
    entity,
    data
  }: {
    entity: Organization;
    data: Partial<CrudOrganizationDbDto>;
  }) {
    await this.putClientToOrg(entity, data.user.id);

    return super.update({ entity, data });
  }

  async putClientToOrg(org: Organization, clientId: number) {
    const client = await this.userDbService.retrieveUser(clientId);
    if (!client) throw new ForbiddenException();
    if (client.organizations.filter((org2) => org.id !== org2.id).length)
      throw new ForbiddenException(
        'Client already assigned with other organization'
      );

    await this.orgDbService.delClientsFromOrg(org);
    return this.orgDbService.addClientToOrg(client, org);
  }
}
