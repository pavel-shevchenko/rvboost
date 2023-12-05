import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDbService } from './user_db.service';
import { JwtAuthGuard } from '../auth/guards';
import RequestWithUser from '../common/typing/request_w_user.interface';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userDbService: UserDbService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('current-user-info')
  jwtUserInfo(@Request() req: RequestWithUser) {
    return req.user;
  }
}
