import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

interface IStartClientCompany {
  companyAddress: string;
  companyLinkDefault: string;
  companyLinkGoogle: string;
  companyLinkTrustPilot: string;
}

interface IStartClient {
  orgName: string;
  companies: Array<IStartClientCompany>;
}

export class StartClientCompany implements IStartClientCompany {
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  @Transform(({ value }) => value?.trim())
  companyAddress: string;

  @IsString({ message: 'Must be a string' })
  @Length(2, 1024, { message: 'От 2 до 1024 символов' })
  @Transform(({ value }) => value?.trim())
  companyLinkDefault: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Length(2, 1024, { message: 'От 2 до 1024 символов' })
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.trim())
  companyLinkGoogle: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Length(2, 1024, { message: 'От 2 до 1024 символов' })
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value?.trim())
  companyLinkTrustPilot: string;
}

export class StartClientDto implements IStartClient {
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  orgName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @Type(() => StartClientCompany)
  companies: StartClientCompany[];
}
