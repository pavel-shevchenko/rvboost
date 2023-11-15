import { ObjectValuesTypesUnion } from '../utils';

export const UserRoleInOrgEnum = {
  owner: 'owner'
} as const;

export type UserRoleInOrgType = ObjectValuesTypesUnion<typeof UserRoleInOrgEnum>;
