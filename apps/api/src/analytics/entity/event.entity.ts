import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { PermissionSubject } from 'casl';
import { EventEnumType, IEvent } from 'typing';
import { BaseEntity } from '../../common/entities/base.entity';
import { CrudEntityFilter } from '../../common/permissions';
import { Card } from '../../card/entity';

@CrudEntityFilter(PermissionSubject.entityEvent)
@Entity({
  tableName: 'events'
})
export class Event extends BaseEntity<Event> implements IEvent {
  @Index()
  @Property({ nullable: false })
  eventType: EventEnumType;

  @ManyToOne(() => Card)
  card: Card;
}
