import { RedirectPlatformType } from '../enums';

export interface ICard {
  isReviewInterception?: boolean;
  isCustomLinkRedirect?: boolean;
  linkCustom?: string;
  shortLinkCode?: string;
  redirectPlatform?: RedirectPlatformType;
}
