import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

interface INewClientCompany {
  companyName: string;
  companyAddress: string;
  companyLinkDefault: string;
  companyLinkGoogle: string;
  companyLinkTrustPilot: string;
}

interface INewClient {
  orgName: string;
  clientEmail: string;
  clientName: string;
  clientPassword: string;
  companies: Array<INewClientCompany>;
}

export class NewClientCompany implements INewClientCompany {
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  @Transform(({ value }) => value?.trim())
  companyName: string;

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

export class NewClientDto implements INewClient {
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  orgName: string;

  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Неправильный e-mail' })
  @Transform(({ value }) => value?.trim())
  clientEmail: string;

  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  @Transform(({ value }) => value?.trim())
  clientName: string;

  @IsString({ message: 'Must be a string' })
  @Length(7, 20, { message: 'От 7 до 20 символов' })
  @Transform(({ value }) => value?.trim())
  clientPassword: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @Type(() => NewClientCompany)
  companies: NewClientCompany[];
}
