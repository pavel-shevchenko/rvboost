import { ICard, RedirectPlatformType } from 'typing';
import { BaseEntity } from '../../common/entities/base.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Location } from '../../location/entity';

@Entity({
  tableName: 'cards'
})
export class Card extends BaseEntity<Card> implements ICard {
  @Property({ default: false })
  isReviewInterception: boolean;

  @Property({ default: false })
  isCustomLinkRedirect: boolean;

  @Property({ nullable: true })
  linkCustom: string;

  @Property({ nullable: true })
  redirectPlatform: RedirectPlatformType;

  @ManyToOne(() => Location)
  location: Location;
}
