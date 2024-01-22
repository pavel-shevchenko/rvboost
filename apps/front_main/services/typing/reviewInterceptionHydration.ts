import { RedirectPlatformType } from 'typing/src/enums/redirect-platform.enum';

export interface ReviewInterceptionHydration {
  locationId: number;
  shortLinkCode: string;
  ratingThreshold: string;
  logo?: string;
  whetherRequestUsername?: boolean;
  requestUsernameRequired?: boolean;
  whetherRequestPhone?: boolean;
  requestPhoneRequired?: boolean;
  whetherRequestEmail?: boolean;
  requestEmailRequired?: boolean;
  questionTitle: string;
  questionDescr: string;
  badReviewRequestText: string;
  badReviewOnSubmitText: string;
  externalResourceAskingText: string;
  redirectPlatform: RedirectPlatformType[];
  linkDefault: string;
  linkGoogle: string;
  linkTrustPilot: string;
}
