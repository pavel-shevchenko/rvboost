import { FastifyRequest } from 'fastify';
import { User } from '../../user/entity';

interface RequestWithUser extends FastifyRequest {
  user: User;
}

export default RequestWithUser;
