import { forwardRef, Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationDbService } from './organization_db.service';
import { OrganizationController } from './organization.controller';
import { UserModule } from '../user';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationDbService],
  exports: [OrganizationService, OrganizationDbService]
})
export class OrganizationModule {}
