import {
  IsISO8601,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsBoolean
} from 'class-validator';
import { IPromocode } from 'typing';
import { Transform } from 'class-transformer';

export class CrudPromocodeDto implements IPromocode {
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => !!value)
  isActivated: boolean | null;

  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => value?.trim())
  activationDate: Date;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  locationsCnt: number;
}
