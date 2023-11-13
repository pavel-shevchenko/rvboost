import { Injectable } from '@nestjs/common';
import { AuthGuard } from '../../fastify-passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
