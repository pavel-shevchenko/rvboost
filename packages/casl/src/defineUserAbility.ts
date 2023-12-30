import { AbilityBuilder, PureAbility, AbilityClass } from '@casl/ability';

import {
  PermissionSubjectType,
  IUser,
  PermissionSubject,
  PermissionAction
} from 'typing';

export type AppAbility = PureAbility<[string, PermissionSubjectType]>;
const appAbility = PureAbility as AbilityClass<AppAbility>;

export function defineUserAbility(user?: IUser) {
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

  return builder.build();
}

function defineAdminRules({ can }: AbilityBuilder<AppAbility>) {
  can('manage', 'all');
}

function defineClientRules({ can, cannot }: AbilityBuilder<AppAbility>) {
  // Rules for organizations
  can(PermissionAction.read, PermissionSubject.entityOrganization);
  // Rules for locations
  can('manage', PermissionSubject.entityLocation);
  cannot(PermissionAction.create, PermissionSubject.entityLocation);
  cannot(PermissionAction.delete, PermissionSubject.entityLocation);
}

function defineAnonymousRules({ cannot }: AbilityBuilder<AppAbility>) {
  cannot('manage', 'all');
}
