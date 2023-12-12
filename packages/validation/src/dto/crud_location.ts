import { IsNumber, IsString, Length } from 'class-validator';
import { ILocation } from 'typing';

export class CrudLocationDto implements ILocation {
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  name: string;

  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  address: string;

  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  linkDefault: string;

  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  linkGoogle: string;

  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  linkTrustPilot: string;

  @IsNumber()
  organization: number;
}
