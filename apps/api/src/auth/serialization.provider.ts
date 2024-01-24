import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FastifyRequest as Request } from 'fastify';
import { User } from '../user/entity';
import { UserDbService } from '../user';
import { PassportSerializer } from '../fastify-passport';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(
    @Inject(forwardRef(() => UserDbService))
    private readonly userDbService: UserDbService
  ) {
    super();
  }

  serializeUser = (user: User, request: Request) => ({ id: +user.id });

  async deserializeUser(payload: { id: number }, request: Request) {
    return this.userDbService.getPassportUserById(payload.id);
  }
}
