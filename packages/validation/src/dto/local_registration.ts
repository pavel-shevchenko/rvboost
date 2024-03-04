import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class LocalRegistrationDto {
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
  @Transform(({ value }) => value.trim())
  readonly password: string;

  @IsString({ message: 'Must be a string' })
  @Length(3, 30, { message: 'От 3 до 30 символов' })
  @Transform(({ value }) => value.trim())
  readonly username: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Transform(({ value }) => value.trim())
  readonly promocode?: string;
}
