import { ForbiddenException } from '@nestjs/common';
import { Filter } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import {
  PermissionAction,
  PermissionActionType,
  PermissionSubject,
  PermissionSubjectType,
  defineUserAbility
} from 'casl';
import { UserRoleInOrgEnum } from 'typing';
import { CrudEntityFilterContext } from '../typing';
import { UserRoleInOrganization } from '../../organization/entity';

export const CrudEntityFilter = (subject: PermissionSubjectType) =>
  Filter({
    name: 'crudEntityFilter',
    cond: async (
      filterContext: CrudEntityFilterContext,
      ormActionName: PermissionActionType,
      entityManager: EntityManager // current instance
    ) => {
      // Next is getting the filter by CASL responsibility
      const userAbility = defineUserAbility(filterContext.user);

      if (userAbility.can('manage', 'all')) {
        // Return obviously reachable condition
        return {};
      }
      if (userAbility.cannot(ormActionName, subject)) {
        throw new ForbiddenException();
      }

      return getFilterOutsideCaslResponsibility(
        filterContext,
        ormActionName,
        subject,
        entityManager
      );
    }
  });

async function getFilterOutsideCaslResponsibility(
  { user }: CrudEntityFilterContext,
  ormActionName: PermissionActionType,
  subject: PermissionSubjectType,
  em: EntityManager
) {
  const isAnonymous = !user;
  // In the current business-logic anonymous can not use CRUD, but maybe change later
  if (isAnonymous) throw new ForbiddenException();

  // Next to the end is getting the filter for the client in the current business-logic:
  const pivots = await em.find<UserRoleInOrganization>(UserRoleInOrganization, {
    user,
    role: UserRoleInOrgEnum.client
  });
  if (!pivots.length) throw new ForbiddenException();

  const organizationsIds = pivots.map((pivot) => pivot.organization.id);
  switch (subject) {
    case PermissionSubject.entityOrganization:
      return { id: organizationsIds };
    case PermissionSubject.entityLocation:
      return { organization: organizationsIds };
    case PermissionSubject.entityCard:
      return { location: { organization: organizationsIds } };
    default:
      throw new ForbiddenException();
  }
}
