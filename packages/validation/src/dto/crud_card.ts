import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length
} from 'class-validator';
import { ICard, RedirectPlatformEnum, RedirectPlatformType } from 'typing';

export class CrudCardDto implements ICard {
  @IsOptional()
  @IsBoolean()
  isReviewInterception: boolean;

  @IsOptional()
  @IsBoolean()
  isCustomLinkRedirect: boolean;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  linkCustom: string;

  @IsOptional()
  @IsEnum(Object.keys(RedirectPlatformEnum))
  redirectPlatform: RedirectPlatformType;

  @IsNumber()
  location: number;
}
