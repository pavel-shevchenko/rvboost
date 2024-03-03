import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../auth/guards';
import { AppRequest } from '../common/typing';
import { OrganizationDbService } from './organization_db.service';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { OrganizationCrudService } from './organization_crud.service';
import { NewClientDto, StartClientDto } from 'validation';

const CRUDController = new MikroCrudControllerFactory<OrganizationCrudService>({
  service: OrganizationCrudService,
  actions: ['query', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 },
    order: { in: ['id:desc'], default: ['id:desc'] },
    expand: {
      in: ['users', 'locations.card'],
      default: ['users', 'locations.card']
    }
  }
}).applyDecoratorToActions(UseGuards(JwtAuthGuard)).product;

@Controller('organization')
export class OrganizationController extends CRUDController {
  constructor(
    private readonly orgService: OrganizationService,
    private readonly orgDbService: OrganizationDbService
  ) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Post('new-owned-organization/:organizationName')
  newOwnedOrganization(
    @Request() req: AppRequest,
    @Param('organizationName') organizationName: string
  ) {
    if (!organizationName) return;
    return this.orgDbService.newOwnedOrganization(req.user, organizationName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-owned-organizations')
  getOwnedOrganizations(@Request() req: AppRequest) {
    return this.orgDbService.getOrganizationsByOwner(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('new-client')
  newClient(@Request() req: AppRequest, @Body() newClientDto: NewClientDto) {
    return this.orgService.newClient(req.user, newClientDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start-client')
  startClient(
    @Request() req: AppRequest,
    @Body() startClientDto: StartClientDto
  ) {
    return this.orgService.startClient(req.user, startClientDto);
  }

  @Get('get-populated-org-for-review-interception-secured52735/:shortLinkCode')
  getOrgForReviewInterception(@Param('shortLinkCode') shortLinkCode: string) {
    return this.orgDbService.populatedOrgByShortLinkCode(shortLinkCode);
  }
}
