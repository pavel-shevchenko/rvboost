import { IFeedbackSettings, RedirectPlatformType } from 'typing';
import { BaseEntity } from '../../common/entities/base.entity';
import {
  Entity,
  Property,
  DecimalType,
  TextType,
  ArrayType,
  OneToOne
} from '@mikro-orm/core';
import { Organization } from '../../organization/entity';

@Entity({
  tableName: 'feedback_settings'
})
export class FeedbackSettings
  extends BaseEntity<FeedbackSettings>
  implements IFeedbackSettings
{
  @Property({ nullable: true })
  questionTitle: string;

  @Property({ type: TextType, nullable: true })
  questionDescr: string;

  @Property({ nullable: true })
  logoS3Key: string;

  @Property({ type: DecimalType, precision: 4, scale: 2, nullable: true })
  ratingThreshold: string;

  @Property({ nullable: true, type: ArrayType })
  redirectPlatform: RedirectPlatformType[];

  @Property({ type: TextType, nullable: true })
  externalResourceAskingText: string;

  @Property({ type: TextType, nullable: true })
  badReviewRequestText: string;

  @Property({ type: TextType, nullable: true })
  badReviewOnSubmitText: string;

  @Property({ default: false })
  whetherRequestUsername: boolean;

  @Property({ default: false })
  requestUsernameRequired: boolean;

  @Property({ default: false })
  whetherRequestPhone: boolean;

  @Property({ default: false })
  requestPhoneRequired: boolean;

  @Property({ default: false })
  whetherRequestEmail: boolean;

  @Property({ default: false })
  requestEmailRequired: boolean;

  @OneToOne(() => Organization, { owner: true, hidden: true })
  organization: Organization;
}
