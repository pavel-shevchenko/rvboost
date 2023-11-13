import passport from '@fastify/passport';
import { FastifyRequest as Request } from 'fastify';

export abstract class PassportSerializer {
  abstract serializeUser(user: any, request: Request);
  abstract deserializeUser(payload: any, request: Request);

  constructor() {
    const passportInstance = this.getPassportInstance();
    passportInstance.registerUserSerializer(async (user, request: Request) =>
      this.serializeUser(user, request)
    );
    passportInstance.registerUserDeserializer(async (payload, request: Request) =>
      this.deserializeUser(payload, request)
    );
  }

  getPassportInstance() {
    return passport;
  }
}
