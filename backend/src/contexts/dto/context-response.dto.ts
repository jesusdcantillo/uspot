import { ContextType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsString } from 'class-validator';

export class ContextResponseDto {
  @IsInt()
  id!: number;

  @IsString()
  name!: string;

  @IsEnum(ContextType)
  type!: ContextType;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;
}
