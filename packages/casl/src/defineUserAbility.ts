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
      defineAdminRules(user, builder);
      break;
    case false:
      defineClientRules(user, builder);
      break;
    default:
      defineAnonymousRules(builder);
  }

  return builder.build({ fieldMatcher });
}

function defineAdminRules(user: any, { can }: AbilityBuilder<AppAbility>) {
  can('manage', 'all');
}

function defineClientRules(
  user: any,
  { can, cannot }: AbilityBuilder<AppAbility>
) {
  // Rules for users
  can(PermissionAction.read, PermissionSubject.entityUser);
  // Rules for organizations
  can(PermissionAction.read, PermissionSubject.entityOrganization);

  // Rules for locations
  can('manage', PermissionSubject.entityLocation);
  cannot(PermissionAction.delete, PermissionSubject.entityLocation);
  cannot(PermissionAction.read, PermissionSubject.entityLocation, [
    'organization'
  ]);

  // Rules for cards
  can('manage', PermissionSubject.entityCard);
  cannot(PermissionAction.create, PermissionSubject.entityCard);
  cannot(PermissionAction.delete, PermissionSubject.entityCard);
  cannot(PermissionAction.viewDetailsOnList, PermissionSubject.entityCard);

  // Checking subscription
  const curDatetime = new Date();
  // Possible thanks to putClientToOrg->ForbiddenException('Client already assigned with other organization') in OrganizationCrudService
  organizationsLoop: for (const organization of user?.organizations || []) {
    for (const subscription of organization?.subscriptions || []) {
      if (new Date(subscription?.validUntil) > curDatetime) {
        // Rules for reviews
        can('manage', PermissionSubject.entityReview);
        cannot(PermissionAction.create, PermissionSubject.entityReview);
        cannot(PermissionAction.delete, PermissionSubject.entityReview);
        can(PermissionAction.reviewInterception, PermissionSubject.entityReview);
        can(PermissionAction.negativeFbManage, PermissionSubject.entityReview);

        break organizationsLoop;
      }
    }
  }
}

function defineAnonymousRules({ cannot }: AbilityBuilder<AppAbility>) {
  cannot('manage', 'all');
}
