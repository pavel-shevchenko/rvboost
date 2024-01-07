import {
  IsBoolean,
  IsByteLength,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsArray,
  ValidateIf,
  Max,
  Min
} from 'class-validator';
import { Transform } from 'class-transformer';

import * as typing from 'typing';

export class FeedbackSettingsDto implements typing.IFeedbackSettings {
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  @Transform(({ value }) => value?.trim())
  questionTitle: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @IsByteLength(0, 65535)
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.trim())
  questionDescr: string;

  @IsNotEmpty()
  @Min(0)
  @Max(9.99)
  @Transform(({ value }) => parseFloat(value?.trim()))
  ratingThreshold: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Object.keys(typing.RedirectPlatformEnum), { each: true })
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.map((item) => item?.trim()))
  redirectPlatform: typing.RedirectPlatformType[];

  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  @IsByteLength(0, 65535)
  externalResourceAskingText: string;

  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  @IsByteLength(0, 65535)
  badReviewRequestText: string;

  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  @IsByteLength(0, 65535)
  badReviewOnSubmitText: string;

  @IsOptional()
  @IsBoolean()
  whetherRequestUsername: boolean;

  @IsOptional()
  @IsBoolean()
  requestUsernameRequired: boolean;

  @IsOptional()
  @IsBoolean()
  whetherRequestPhone: boolean;

  @IsOptional()
  @IsBoolean()
  requestPhoneRequired: boolean;

  @IsOptional()
  @IsBoolean()
  whetherRequestEmail: boolean;

  @IsOptional()
  @IsBoolean()
  requestEmailRequired: boolean;
}
