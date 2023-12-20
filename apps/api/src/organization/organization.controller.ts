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
import { RequestWithUser } from '../common/typing';
import { OrganizationDbService } from './organization_db.service';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { OrganizationCrudService } from './organization_crud.service';
import { NewClientDto } from 'validation';

const CRUDController = new MikroCrudControllerFactory<OrganizationCrudService>({
  service: OrganizationCrudService,
  actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 }
  }
}).product;

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

  @UseGuards(JwtAuthGuard)
  @Post('new-client')
  newClient(@Request() req: RequestWithUser, @Body() newClientDto: NewClientDto) {
    return this.orgService.newClient(req.user, newClientDto);
  }
}
