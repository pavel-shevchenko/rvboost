import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard, LocalAuthGuard } from './guards';
import { LocalRegistrationDto, ResetPasswordDto } from 'validation';
import { AppRequest } from '../common/typing';
import { SocialAuthProvider } from '../common/typing/social_auth.types';
import { FastifyReply } from 'fastify';

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

  @Get(SocialAuthProvider.google)
  @UseGuards(GoogleAuthGuard)
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get(SocialAuthProvider.google + '/callback')
  @UseGuards(GoogleAuthGuard)
  googleLoginRedirect(@Request() req: AppRequest, @Res() res: FastifyReply) {
    this.authService.showSocialAuthSuccess(req.user, res);
  }

  @Get('reset-password/:email')
  async resetPassword(@Param('email') email: string) {
    return this.authService.resetPassword(email);
  }

  @Post('restore-password')
  restorePassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.restorePassword(resetPasswordDto);
  }
}
