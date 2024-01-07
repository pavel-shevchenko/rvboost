import { RedirectPlatformType } from '../enums';

export interface IFeedbackSettings {
  questionTitle: string;
  questionDescr: string;
  ratingThreshold: string;
  redirectPlatform: RedirectPlatformType[];
  externalResourceAskingText: string;
  badReviewRequestText: string;
  badReviewOnSubmitText: string;
  whetherRequestUsername: boolean;
  requestUsernameRequired: boolean;
  whetherRequestPhone: boolean;
  requestPhoneRequired: boolean;
  whetherRequestEmail: boolean;
  requestEmailRequired: boolean;
}
