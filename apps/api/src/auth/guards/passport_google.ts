import { Injectable } from '@nestjs/common';
import { AuthGuard } from '../../fastify-passport';
import { SocialAuthProvider } from '../../common/typing/social_auth.types';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(SocialAuthProvider.google) {}
