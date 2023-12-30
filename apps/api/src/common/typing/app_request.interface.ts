import { FastifyRequest } from 'fastify';
import { User } from '../../user/entity';

export interface AppRequest extends FastifyRequest {
  user: User;
}
