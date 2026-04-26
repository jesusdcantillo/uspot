import { IsInt, IsOptional, IsString } from 'class-validator';

export class SpotImageResponseDto {
  @IsInt()
  id!: number;

  @IsString()
  url!: string;

  @IsInt()
  @IsOptional()
  order?: number;
}
