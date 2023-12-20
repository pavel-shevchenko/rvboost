import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateIf
} from 'class-validator';
import * as typing from 'typing';
import { Transform } from 'class-transformer';

export class CrudCardDto implements typing.ICard {
  @IsOptional()
  @IsBoolean()
  isReviewInterception: boolean;

  @IsOptional()
  @IsBoolean()
  isCustomLinkRedirect: boolean;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.trim())
  linkCustom: string;

  @IsOptional()
  @IsEnum(Object.keys(typing.RedirectPlatformEnum))
  redirectPlatform: typing.RedirectPlatformType;

  @IsNumber()
  location: number;
}
