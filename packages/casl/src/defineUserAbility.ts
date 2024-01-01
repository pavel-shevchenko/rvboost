import {
  AbilityBuilder,
  PureAbility,
  AbilityClass,
  FieldMatcher
} from '@casl/ability';
import {
  PermissionAction,
  PermissionSubject,
  PermissionSubjectType
} from './legacy_typing';

export type AppAbility = PureAbility<[string, PermissionSubjectType]>;
const appAbility = PureAbility as AbilityClass<AppAbility>;
const fieldMatcher: FieldMatcher = (fields) => (field) => fields.includes(field);

export function defineUserAbility(user?: any) {
  const builder = new AbilityBuilder<AppAbility>(appAbility);
  switch (user?.isAdmin) {
    case true:
      defineAdminRules(builder);
      break;
    case false:
      defineClientRules(builder);
      break;
    default:
      defineAnonymousRules(builder);
  }

  return builder.build({ fieldMatcher });
}

function defineAdminRules({ can }: AbilityBuilder<AppAbility>) {
  can('manage', 'all');
}

function defineClientRules({ can, cannot }: AbilityBuilder<AppAbility>) {
  // Rules for users
  // can(PermissionAction.read, PermissionSubject.entityUser);
  // Rules for organizations
  // can(PermissionAction.read, PermissionSubject.entityOrganization);
  // Rules for locations
  can('manage', PermissionSubject.entityLocation);
  cannot(PermissionAction.create, PermissionSubject.entityLocation);
  cannot(PermissionAction.delete, PermissionSubject.entityLocation);
  cannot(PermissionAction.read, PermissionSubject.entityLocation, [
    'organization'
  ]);
  // Rules for cards
  can('manage', PermissionSubject.entityCard);
  cannot(PermissionAction.create, PermissionSubject.entityCard);
  cannot(PermissionAction.delete, PermissionSubject.entityCard);
  cannot(PermissionAction.viewDetailsOnList, PermissionSubject.entityCard);
}

function defineAnonymousRules({ cannot }: AbilityBuilder<AppAbility>) {
  cannot('manage', 'all');
}
