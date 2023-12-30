import { ObjectValuesTypesUnion } from '../utils';

export const PermissionSubject = {
  all: 'all',
  entityUser: 'entityUser',
  entityOrganization: 'entityOrganization',
  entityLocation: 'entityLocation',
  entityCard: 'entityCard',
  entityReview: 'entityReview',
  pageNewClient: 'pageNewClient',
  pageCompanies: 'pageCompanies'
} as const;

export type PermissionSubjectType = ObjectValuesTypesUnion<
  typeof PermissionSubject
>;

export const PermissionAction = {
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete'
} as const;

export type PermissionActionType = ObjectValuesTypesUnion<
  typeof PermissionAction
>;
