import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OAuth2Strategy as Strategy, Profile } from 'passport-google-oauth';

import { PassportStrategy } from '../../fastify-passport';
import {
  SocialAuthPayload,
  SocialAuthProvider
} from '../../common/typing/social_auth.types';
import { UserService } from '../../user';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  SocialAuthProvider.google
) {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
    super({
      clientID: process.env?.GOOGLE_APP_ID,
      clientSecret: process.env?.GOOGLE_APP_SECRET,
      callbackURL: `${process.env?.NEXT_PUBLIC_SERVER_URL}/api/auth/${SocialAuthProvider.google}/callback`,
      scope: ['email', 'profile'],
      profileFields: ['provider', 'id', 'emails', 'name', 'gender', 'photos']
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { provider, id, name, emails, photos } = profile;
    const socialAuthPayload: SocialAuthPayload = {
      accessToken,
      provider: provider,
      socialId: id,
      email: emails.shift()?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      avatar: photos.shift()?.value
    };

    done(
      null,
      await this.userService.getPassportUserBySocialId(
        SocialAuthProvider.google,
        socialAuthPayload
      )
    );
  }
}
