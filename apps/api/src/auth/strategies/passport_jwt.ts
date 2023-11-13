import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDbService } from '../../user';
import { PassportStrategy } from '../../fastify-passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => UserDbService))
    private readonly userDbService: UserDbService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env?.JWT_SECRET
    });
  }

  validate(payload: any) {
    return this.userDbService.getPassportUserById(payload.sub);
  }
}
