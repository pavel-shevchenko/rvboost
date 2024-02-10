import {
  Collection,
  Entity,
  Formula,
  ManyToOne,
  OneToOne,
  Property
} from '@mikro-orm/core';
import { EventEnum, ILocation } from 'typing';
import { PermissionSubject } from 'casl';
import { BaseEntity } from '../../common/entities/base.entity';
import { Organization } from '../../organization/entity';
import { Card } from '../../card/entity';
import { CrudEntityFilter } from '../../common/permissions';

@CrudEntityFilter(PermissionSubject.entityLocation)
@Entity({
  tableName: 'locations'
})
export class Location extends BaseEntity<Location> implements ILocation {
  @Property({ nullable: false })
  name: string;

  @Property({ nullable: false })
  address: string;

  @Property({ persist: false })
  get nameDashAddress() {
    return `${this.name}-${this.address}`;
  }

  @Property({ nullable: false })
  linkDefault: string;

  @Property({ nullable: true })
  linkGoogle: string;

  @Property({ nullable: true })
  linkTrustPilot: string;

  @ManyToOne(() => Organization)
  organization: Organization;

  @OneToOne(() => Card, (card) => card.location, { owner: false })
  card: Card;

  @Formula(
    (alias) =>
      `(select count(*) from events e where e.event_type = '${EventEnum.followExternalLink}' and e.card_id in (select id from cards c where c.location_id = ${alias}.id))`,
    { lazy: true }
  )
  externalFollowedEventsCount?: number;

  @Formula(
    (alias) =>
      `(select count(*) from reviews r where r.location_id = ${alias}.id)`,
    { lazy: true }
  )
  reviewsCount?: number;

  @Formula(
    (alias) =>
      `(select avg(review_rating) from reviews r where r.location_id = ${alias}.id)`,
    { lazy: true }
  )
  avgRating?: number;
}
