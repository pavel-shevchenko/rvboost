import { ObjectValuesTypesUnion } from '../utils';

export const EventEnum = {
  followExternalLink: 'followExternalLink',
  showReviewFormWithRating: 'showReviewFormWithRating',
  showReviewFormWithPlatform: 'showReviewFormWithPlatform',
  showReviewFormWithBad: 'showReviewFormWithBad',
  submitReviewFormWithBad: 'submitReviewFormWithBad'
} as const;

export type EventEnumType = ObjectValuesTypesUnion<typeof EventEnum>;
