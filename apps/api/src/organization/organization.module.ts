import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { OrganizationService } from './organization.service';
import { OrganizationDbService } from './organization_db.service';
import { OrganizationController } from './organization.controller';
import { UserModule } from '../user';
import { MikroCrudModule } from '../nestjs-crud';
import { Organization } from './entity';
import { OrganizationCrudService } from './organization_crud.service';
import { LocationModule } from '../location';

@Module({
  imports: [
    LocationModule,
    MikroCrudModule,
    MikroOrmModule.forFeature([Organization]),
    forwardRef(() => UserModule)
  ],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    OrganizationDbService,
    OrganizationCrudService
  ],
  exports: [OrganizationService, OrganizationDbService]
})
export class OrganizationModule {}
