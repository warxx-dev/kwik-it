import { IsOptional, IsString } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  readonly originalUrl: string;

  @IsString()
  @IsOptional()
  readonly code: string;

  @IsString()
  @IsOptional()
  readonly email: string;
}
