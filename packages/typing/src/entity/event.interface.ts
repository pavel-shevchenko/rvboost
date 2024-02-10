import { EventEnumType } from '../enums';

export interface IEvent {
  eventType?: EventEnumType;
  createdAt?: Date;
}
