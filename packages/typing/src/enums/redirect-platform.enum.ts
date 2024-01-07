import { ObjectValuesTypesUnion } from '../utils';

export const RedirectPlatformEnum = {
  default: 'default',
  google: 'google',
  trustpilot: 'trustpilot'
} as const;

export type RedirectPlatformType = ObjectValuesTypesUnion<
  typeof RedirectPlatformEnum
>;
