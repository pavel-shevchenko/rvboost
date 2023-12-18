import { RedirectPlatformType } from '../enums';

export interface IReview {
  isBadFormCollected: boolean;
  authorName: string;
  authorEmail: string;
  authorPhone: string;
  reviewText: string;
  reviewRating: string;
  publicationDatetime: Date;
  replyDatetime: Date;
  replyText: string;
  reviewExternalLink: string;
  platform: RedirectPlatformType;
}
