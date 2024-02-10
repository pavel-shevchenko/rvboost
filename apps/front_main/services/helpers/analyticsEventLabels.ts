import { EventEnum } from 'typing/src/enums';

export const eventLabels = {
  [EventEnum.followExternalLink]: 'переход на внешний ресурс',
  [EventEnum.showReviewFormWithRating]:
    'отображение формы сбора отзыва с экраном оценки',
  [EventEnum.showReviewFormWithPlatform]:
    'отображение формы сбора отзыва с экраном выбора платформы',
  [EventEnum.showReviewFormWithBad]: 'отображение формы сбора негативного отзыва',
  [EventEnum.submitReviewFormWithBad]: 'сабмит формы сбора негативного отзыва'
};
