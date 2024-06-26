type ObjectValuesTypesUnion<TObj> = TObj[keyof TObj];

export const PermissionSubject = {
  all: 'all',
  entityUser: 'entityUser',
  entityOrganization: 'entityOrganization',
  entitySubscription: 'entitySubscription',
  entityPromocode: 'entityPromocode',
  entityLocation: 'entityLocation',
  entityCard: 'entityCard',
  entityReview: 'entityReview',
  entityFbSettings: 'entityFbSettings',
  entityEvent: 'entityEvent',
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
  delete: 'delete',
  viewDetailsOnList: 'viewDetailsOnList',
  reviewInterception: 'reviewInterception',
  negativeFbManage: 'negativeFbManage'
} as const;

export type PermissionActionType = ObjectValuesTypesUnion<
  typeof PermissionAction
>;
