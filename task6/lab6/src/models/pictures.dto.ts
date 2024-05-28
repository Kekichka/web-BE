import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty,IsOptional } from '@nestjs/class-validator';
import { IsNumber } from 'class-validator';

export class PicturesDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  pageNumber: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  totalCount: number;

}
