import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

export const generateShortLinkCode = () =>
  randomStringGenerator().substring(0, 12);

export const getShortLink = (code: string) => `https://link.rvboost.me/${code}`;

export const getS3qrCodeFullKey = (s3shortKey: string) => `${s3shortKey}.png`;
