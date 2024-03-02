import {
  IsBoolean,
  IsByteLength,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateIf
} from 'class-validator';
import { Transform } from 'class-transformer';

import * as typing from 'typing';

export class CrudReviewDto implements typing.IReview {
  @IsOptional()
  @IsBoolean()
  isBadFormCollected: boolean;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.trim())
  authorName: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.trim())
  authorEmail: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.trim())
  authorPhone: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @IsByteLength(0, 65535)
  reviewText: string;

  @IsOptional()
  @Min(1)
  @Max(5)
  @ValidateIf((object, value) => value !== null)
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  reviewRating: string;

  @IsNotEmpty()
  @IsISO8601()
  @Transform(({ value }) => value?.trim())
  publicationDatetime: Date;

  @IsOptional()
  @IsISO8601()
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.trim())
  replyDatetime: Date;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @IsByteLength(0, 65535)
  replyText: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.trim())
  reviewExternalLink: string;

  @IsOptional()
  @IsEnum(Object.keys(typing.RedirectPlatformEnum))
  platform: typing.RedirectPlatformType;

  @IsOptional()
  @IsNumber()
  location: number;
}
