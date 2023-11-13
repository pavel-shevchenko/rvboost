import { IsEmail, IsString, Length, Matches } from "class-validator";
import { Transform } from "class-transformer";

export class ResetPasswordDto {
  @IsString({ message: "Must be a string" })
  @IsEmail({}, { message: "Неправильный e-mail" })
  @Transform(({ value }) => value.trim())
  readonly email: string;

  /*
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
    message: 'New passwd must include special char, capital char, also a digit',
  })
  */
  @IsString({ message: "Must be a string" })
  @Length(7, 20, { message: "От 7 до 20 символов" })
  @Transform(({ value }) => value.trim())
  readonly newPassword: string;

  @IsString({ message: "Must be a string" })
  @Transform(({ value }) => value.trim())
  readonly token: string;
}
