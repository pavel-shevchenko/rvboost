export const getShortLink = (code: string) => `https://link.rvboost.me/${code}`;

export const getQrImageLink = (code: string) =>
  `http://193.168.46.135/api/card/get-qr-code-image/${code}`;
