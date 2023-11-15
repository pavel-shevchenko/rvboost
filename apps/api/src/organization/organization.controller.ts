import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../auth/guards';
import RequestWithUser from '../common/typing/request_w_user.interface';
import { OrganizationDbService } from './organization_db.service';

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private orgDbService: OrganizationDbService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('new-owned-organization/:organizationName')
  newOwnedOrganization(
    @Request() req: RequestWithUser,
    @Param('organizationName') organizationName: string
  ) {
    if (!organizationName) return;
    return this.orgDbService.newOwnedOrganization(req.user, organizationName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-owned-organization')
  getOwnedOrganizations(@Request() req: RequestWithUser) {
    return this.orgDbService.getOwnedOrganizations(req.user);
  }
}
