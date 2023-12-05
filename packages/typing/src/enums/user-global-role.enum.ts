import { ObjectValuesTypesUnion } from '../utils';

export const UserGlobalRoleEnum = {
  admin: 'admin'
} as const;

export type UserGlobalRoleType = ObjectValuesTypesUnion<
  typeof UserGlobalRoleEnum
>;
