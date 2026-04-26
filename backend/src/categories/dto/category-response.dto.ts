import { IsInt, IsString, IsOptional } from 'class-validator';

export class CategoryResponseDto {
  @IsInt()
  id!: number;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
