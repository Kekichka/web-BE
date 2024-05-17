import { IsString, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PageLinkDto {
  @IsString()
  pageLink: string;
}

export class CreateBookDto {
  @IsString()
  title: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PageLinkDto)
  pageLinks: PageLinkDto[];
}

export class SubmitPartDto {
  @IsString()
  text: string;

  @IsString()
  otp: string;
}


