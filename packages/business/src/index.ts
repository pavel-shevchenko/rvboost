export const getReviewFormLink = (code: string) =>
  `https://form.rvboost.me/${code}`;

export const getShortLink = (code: string) => `https://link.rvboost.me/${code}`;

export const getQrImageLink = (code: string) =>
  `https://media.rvboost.me/api/card/get-qr-code-image/${code}`;
