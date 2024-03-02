import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDbService } from './user_db.service';
import { JwtAuthGuard } from '../auth/guards';
import { AppRequest } from '../common/typing';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { UserCrudService } from './user_crud.service';

const CRUDController = new MikroCrudControllerFactory<UserCrudService>({
  service: UserCrudService,
  actions: ['query', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 },
    order: { in: ['id:desc'], default: ['id:desc'] }
  }
}).applyDecoratorToActions(UseGuards(JwtAuthGuard)).product;

@Controller('user')
export class UserController extends CRUDController {
  constructor(
    private readonly userService: UserService,
    private readonly userDbService: UserDbService
  ) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Get('current-user-info')
  jwtUserInfo(@Request() req: AppRequest) {
    return this.userService.getUserInfo(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-username/:username')
  async changeUsername(
    @Request() req: AppRequest,
    @Param('username') username: string
  ) {
    if (!username) throw new ForbiddenException();

    req.user.username = username;
    return this.userDbService.saveUser(req.user);
  }
}
