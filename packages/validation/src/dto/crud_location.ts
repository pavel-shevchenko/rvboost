import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateIf
} from 'class-validator';
import { ILocation } from 'typing';
import { Transform } from 'class-transformer';

export class CrudLocationDto implements ILocation {
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  name: string;

  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  address: string;

  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  @Transform(({ value }) => value?.trim())
  linkDefault: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.trim())
  linkGoogle: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.trim())
  linkTrustPilot: string;

  @IsNumber()
  organization: number;
}
