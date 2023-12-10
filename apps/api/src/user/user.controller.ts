import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDbService } from './user_db.service';
import { JwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../common/typing';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { UserCrudService } from './user_crud.service';

const CRUDController = new MikroCrudControllerFactory<UserCrudService>({
  service: UserCrudService,
  actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 }
  }
}).product;

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
  jwtUserInfo(@Request() req: RequestWithUser) {
    return req.user;
  }
}
