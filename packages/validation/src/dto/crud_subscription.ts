import { IsISO8601, IsNumber, IsNotEmpty } from 'class-validator';
import { ISubscription } from 'typing';
import { Transform } from 'class-transformer';

export class CrudSubscriptionDto implements ISubscription {
  @IsNotEmpty()
  @IsISO8601()
  @Transform(({ value }) => value?.trim())
  validUntil: Date;

  @IsNumber()
  organization: number;
}
