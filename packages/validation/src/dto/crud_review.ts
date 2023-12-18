import {
  IsBoolean,
  IsByteLength,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateIf
} from 'class-validator';
import { IReview, RedirectPlatformEnum, RedirectPlatformType } from 'typing';
import { Transform } from 'class-transformer';

export class CrudReviewDto implements IReview {
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
  @IsNumberString()
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.trim())
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
  @IsEnum(Object.keys(RedirectPlatformEnum))
  platform: RedirectPlatformType;

  @IsOptional()
  @IsNumber()
  location: number;
}
