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
import { IOrganization } from 'typing';

class UserClientInOrg {
  @IsNotEmpty()
  id: number;
}

export class CrudOrganizationDto implements IOrganization {
  @IsString({ message: 'Must be a string' })
  @Length(2, 200, { message: 'От 2 до 200 символов' })
  readonly name: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => UserClientInOrg)
  user!: UserClientInOrg;
}
