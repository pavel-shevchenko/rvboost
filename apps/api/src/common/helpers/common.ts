import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

export const generateShortLinkCode = () =>
  randomStringGenerator().substring(0, 12);

export const getS3qrCodeFullKey = (s3shortKey: string) => `${s3shortKey}.png`;

export function addMonths(date: Date, months: number) {
  var result = new Date(date),
    expectedMonth = (((date.getMonth() + months) % 12) + 12) % 12;
  result.setMonth(result.getMonth() + months);
  if (result.getMonth() !== expectedMonth) {
    result.setDate(0);
  }
  return result;
}
