import { Entity, Formula, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { EventEnum, ILocation } from 'typing';
import { PermissionSubject } from 'casl';
import { BaseEntity } from '../../common/entities/base.entity';
import { Organization } from '../../organization/entity';
import { Card } from '../../card/entity';
import { CrudEntityFilter } from '../../common/permissions';
import { addMonths } from '../../common/helpers/common';

function getMinusOneMonthSQL() {
  return addMonths(new Date(), -1).toISOString().slice(0, 19).replace('T', ' ');
}

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

  @Formula(
    (alias) =>
      `(select count(*) from reviews r where r.location_id = ${alias}.id and created_at >= '${getMinusOneMonthSQL()}')`,
    { lazy: true }
  )
  reviewsCountLast30days?: number;

  @Formula(
    (alias) =>
      `(select count(*) from events e where e.event_type = '${
        EventEnum.followExternalLink
      }' and e.card_id in (select id from cards c where c.location_id = ${alias}.id) and e.created_at >= '${getMinusOneMonthSQL()}')`,
    { lazy: true }
  )
  externalFollowEventsCntLast30days?: number;

  @Formula(
    (alias) =>
      `(select count(*) from events e where e.event_type = '${
        EventEnum.showReviewFormWithRating
      }' and e.card_id in (select id from cards c where c.location_id = ${alias}.id) and e.created_at >= '${getMinusOneMonthSQL()}')`,
    { lazy: true }
  )
  showRatingFormEventsCntLast30days?: number;

  @Formula(
    (alias) =>
      `(select count(*) from events e where e.event_type = '${
        EventEnum.showReviewFormWithPlatform
      }' and e.card_id in (select id from cards c where c.location_id = ${alias}.id) and e.created_at >= '${getMinusOneMonthSQL()}')`,
    { lazy: true }
  )
  showPlatformFormEventsCntLast30days?: number;

  @Formula(
    (alias) =>
      `(select count(*) from events e where e.event_type = '${
        EventEnum.showReviewFormWithBad
      }' and e.card_id in (select id from cards c where c.location_id = ${alias}.id) and e.created_at >= '${getMinusOneMonthSQL()}')`,
    { lazy: true }
  )
  showBadFormEventsCntLast30days?: number;

  @Formula(
    (alias) =>
      `(select count(*) from events e where e.event_type = '${
        EventEnum.submitReviewFormWithBad
      }' and e.card_id in (select id from cards c where c.location_id = ${alias}.id) and e.created_at >= '${getMinusOneMonthSQL()}')`,
    { lazy: true }
  )
  submitBadFormEventsCntLast30days?: number;
}
