import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Length,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class UserClientInOrg {
  @IsNotEmpty()
  id: number;
}

export class CrudOrganizationDto {
  @IsString({ message: 'Must be a string' })
  @Length(2, 30, { message: 'От 2 до 30 символов' })
  readonly name: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => UserClientInOrg)
  user!: UserClientInOrg;
}
