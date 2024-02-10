import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional
} from 'class-validator';
import * as typing from 'typing';
import { Transform } from 'class-transformer';

export class CrudEventDto implements typing.IEvent {
  @IsOptional()
  @IsEnum(Object.keys(typing.EventEnum))
  eventType?: typing.EventEnumType;

  @IsNotEmpty()
  @IsISO8601()
  @Transform(({ value }) => value?.trim())
  createdAt: Date;

  @IsNumber()
  card: number;
}
