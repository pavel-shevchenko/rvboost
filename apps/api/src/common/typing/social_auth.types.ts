export enum SocialAuthProvider {
  google = 'google'
}

export type SocialAuthPayload = {
  accessToken: string;
  provider: string;
  socialId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
};
