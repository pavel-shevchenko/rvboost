import { ObjectValuesTypesUnion } from '../utils';

export const RedirectPlatformEnum = {
  google: 'google',
  trustpilot: 'trustpilot'
} as const;

export type RedirectPlatformType = ObjectValuesTypesUnion<
  typeof RedirectPlatformEnum
>;
