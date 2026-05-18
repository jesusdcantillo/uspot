import { ContextType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ContextResponseDto {
  @IsInt()
  id!: number;

  @IsString()
  name!: string;

  @IsEnum(ContextType)
  type!: ContextType;

  @IsNumber()
  @IsOptional()
  latitude!: number | null;

  @IsNumber()
  @IsOptional()
  longitude!: number | null;

  @IsInt()
  @IsOptional()
  zoom!: number | null;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;
}
