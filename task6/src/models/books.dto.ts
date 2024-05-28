import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, ValidateNested, IsNumber } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

class PageLinkDto {
  @IsString()
  pageLink: string;
}

export class BooksDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  pageNumber: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PageLinkDto)
  pageLinks: PageLinkDto[];
}

