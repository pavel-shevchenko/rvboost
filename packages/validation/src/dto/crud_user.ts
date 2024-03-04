import {
  IsEmail,
  IsString,
  IsNumberString, // use it for number from url request param
  Length,
  IsBoolean,
  ValidateIf,
  IsOptional
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IUser } from 'typing';

export class CrudUserDto implements IUser {
  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Неправильный e-mail' })
  @Transform(({ value }) => value.trim())
  readonly email: string;

  /*
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
    message: "Password must include special char, capital char, also a digit",
  })
  */
  @IsString({ message: 'Must be a string' })
  @Length(7, 20, { message: 'От 7 до 20 символов' })
  @ValidateIf((object, value) => !!value)
  @Transform(({ value }) => value.trim())
  readonly password: string;

  @IsString({ message: 'Must be a string' })
  @Length(2, 30, { message: 'От 2 до 30 символов' })
  readonly username: string;

  @IsBoolean()
  readonly isAdmin: boolean | null;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  promoRegedCode?: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  promoRegedCountry?: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  promoRegedCity?: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  promoRegedAddress?: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  promoRegedZip?: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  promoRegedName?: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  promoRegedSurname?: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  promoRegedPhone?: string;
}
