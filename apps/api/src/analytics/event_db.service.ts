import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Event } from './entity';
import { EventEnum, EventEnumType } from 'typing';

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

  countEventsByTypeAndDay(eventType: EventEnumType, day: Date) {
    const start = new Date(day);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setUTCHours(23, 59, 59, 999);

    return this.em.count(Event, {
      eventType,
      createdAt: {
        $gte: start,
        $lt: end
      }
    });
  }
}
