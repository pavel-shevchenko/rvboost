import { PermissionSubject } from 'casl';
import { ICard, RedirectPlatformType } from 'typing';
import { BaseEntity } from '../../common/entities/base.entity';
import { Entity, Index, OneToOne, Property } from '@mikro-orm/core';
import { Location } from '../../location/entity';
import { CrudEntityFilter } from '../../common/permissions';

@CrudEntityFilter(PermissionSubject.entityCard)
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

  @OneToOne(() => Location, { owner: true })
  location: Location;

  @Index()
  @Property({ nullable: false })
  shortLinkCode: string;
}
