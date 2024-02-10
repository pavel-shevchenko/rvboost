import {
  Collection,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  Property
} from '@mikro-orm/core';
import { PermissionSubject } from 'casl';
import { ICard, RedirectPlatformType } from 'typing';
import { BaseEntity } from '../../common/entities/base.entity';
import { Location } from '../../location/entity';
import { CrudEntityFilter } from '../../common/permissions';
import { Event } from '../../analytics/entity';

@CrudEntityFilter(PermissionSubject.entityCard)
@Entity({
  tableName: 'cards'
})
export class Card extends BaseEntity<Card> implements ICard {
  @Index()
  @Property({ nullable: false })
  shortLinkCode: string;

  @Property({ default: false })
  isReviewInterception: boolean;

  @Property({ default: false })
  isCustomLinkRedirect: boolean;

  @Property({ nullable: true })
  linkCustom: string;

  @Property({ nullable: true })
  redirectPlatform: RedirectPlatformType;

  @OneToOne(() => Location, { owner: true })
  location: Location;

  @OneToMany(() => Event, (event) => event.card)
  events = new Collection<Event>(this);
}
