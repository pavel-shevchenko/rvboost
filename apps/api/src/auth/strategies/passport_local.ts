import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '../../fastify-passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'login_or_email' });
  }

  async validate(username: string, password: string): Promise<any> {
    return await this.authService.validateUserByEmailAndPass(username, password);
  }
}
