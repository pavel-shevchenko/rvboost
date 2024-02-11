import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Event } from './entity';
import { EventEnum, EventEnumType } from 'typing';
import { Organization } from '../organization/entity';
import { FilterQuery } from '@mikro-orm/core';

@Injectable()
export class EventDbService {
  constructor(private readonly em: EntityManager) {}

  todayExternalFollowedEventsCount() {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    return this.em.count(Event, {
      eventType: EventEnum.followExternalLink,
      createdAt: {
        $gte: todayStart
      }
    });
  }

  countEventsByTypeDayOrg(
    eventType: EventEnumType,
    day: Date,
    organization: Organization = null
  ) {
    const start = new Date(day);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setUTCHours(23, 59, 59, 999);

    const where: FilterQuery<Event> = {
      eventType,
      createdAt: {
        $gte: start,
        $lt: end
      }
    };
    if (organization)
      where.card = {
        location: { organization }
      };

    return this.em.count(Event, where);
  }

  countEventsByTypeAndOrg(eventType: EventEnumType, organization: Organization) {
    return this.em.count(Event, {
      eventType,
      card: {
        location: { organization }
      }
    });
  }
}
