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
import { LocalAuthGuard } from './guards';
import { LocalRegistrationDto, ResetPasswordDto } from 'validation';
import { AppRequest } from '../common/typing';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local-registration')
  localRegistration(@Body() userDto: LocalRegistrationDto) {
    return this.authService.registration(userDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('local-login')
  async localLogin(@Request() req: AppRequest) {
    return this.authService.getAuthTokenWithUser(req.user);
  }

  @Get('reset-password/:email')
  async resetPassword(@Param('email') email: string): Promise<any> {
    return this.authService.resetPassword(email);
  }

  @Post('restore-password')
  restorePassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.restorePassword(resetPasswordDto);
  }
}
