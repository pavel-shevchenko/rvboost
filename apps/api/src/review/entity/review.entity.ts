import { IReview, PermissionSubject, RedirectPlatformType } from 'typing';
import { BaseEntity } from '../../common/entities/base.entity';
import {
  Entity,
  ManyToOne,
  Property,
  DecimalType,
  TextType
} from '@mikro-orm/core';
import { Location } from '../../location/entity';
import { CrudEntityFilter } from '../../common/permissions';

@CrudEntityFilter(PermissionSubject.entityReview)
@Entity({
  tableName: 'reviews'
})
export class Review extends BaseEntity<Review> implements IReview {
  @Property({ default: false })
  isBadFormCollected: boolean;

  @Property({ nullable: true })
  authorName: string;

  @Property({ nullable: true })
  authorEmail: string;

  @Property({ nullable: true })
  authorPhone: string;

  @Property({ type: TextType, nullable: true })
  reviewText: string;

  @Property({ type: DecimalType, precision: 3, scale: 2, nullable: true })
  reviewRating: string;

  @Property({ nullable: false })
  publicationDatetime: Date;

  @Property({ nullable: true })
  replyDatetime: Date;

  @Property({ type: TextType, nullable: true })
  replyText: string;

  @Property({ nullable: true })
  reviewExternalLink: string;

  @Property({ nullable: true })
  platform: RedirectPlatformType;

  @ManyToOne(() => Location, { nullable: true })
  location: Location;
}
