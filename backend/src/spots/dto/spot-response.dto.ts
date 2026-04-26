import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';
import { SpotImageResponseDto } from './spot-image-response.dto';

export class SpotResponseDto {
  @IsInt()
  id!: number;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsInt()
  userId!: number;

  @ValidateNested()
  @Type(() => CategoryResponseDto)
  category!: CategoryResponseDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpotImageResponseDto)
  images!: SpotImageResponseDto[];

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
