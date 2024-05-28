import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from '@nestjs/class-validator';
import { IsOptional } from 'class-validator';

export class PartsDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  picturesId: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  box: string;

  @ApiProperty({ type: String })
  @IsOptional()
  otp: string;
}
