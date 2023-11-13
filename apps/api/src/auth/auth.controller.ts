import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { LocalRegistrationDto, ResetPasswordDto } from 'validation';
import RequestWithUser from '../common/typing/request_w_user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local-registration')
  localRegistration(@Body() userDto: LocalRegistrationDto) {
    return this.authService.registration(userDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('local-login')
  async localLogin(@Request() req: RequestWithUser) {
    return this.authService.generateToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jwt-user-info')
  jwtUserInfo(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Get('restore-password/:email')
  async restorePassword(@Param('email') email: string): Promise<any> {
    return this.authService.restorePassword(email);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
