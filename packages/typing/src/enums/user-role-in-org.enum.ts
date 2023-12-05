import { ObjectValuesTypesUnion } from '../utils';

export const UserRoleInOrgEnum = {
  owner: 'owner',
  client: 'client'
} as const;

export type UserRoleInOrgType = ObjectValuesTypesUnion<typeof UserRoleInOrgEnum>;
