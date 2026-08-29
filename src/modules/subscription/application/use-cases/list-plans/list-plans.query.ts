import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

export class ListPlansQuery {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeInactive?: boolean;
}
