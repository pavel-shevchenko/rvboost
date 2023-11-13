import { Injectable } from '@nestjs/common';
import { AuthGuard } from '../../fastify-passport';

@Injectable()
// Allows unauthenticated users to also access the route
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest so it never throws an error
  handleRequest(err, user, info, context) {
    return user || null;
  }
}
