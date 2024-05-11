import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsUrl, IsDateString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ description: 'Title of the book', type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Array of page links for the book', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) 
  @IsUrl({}, { each: true }) 
  pageLinks: string[];
}
