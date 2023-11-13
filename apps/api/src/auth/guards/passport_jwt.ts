import { Injectable } from '@nestjs/common';
import { AuthGuard } from '../../fastify-passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
