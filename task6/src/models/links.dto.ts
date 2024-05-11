import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateLinkDto {
  @ApiProperty({ description: 'Original link to be shortened', type: String })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  originalLink: string;

  @ApiProperty({ description: 'Shortened link to be shortened', type: String })
  @IsNotEmpty()
  @IsOptional()
  @IsUrl()
  shortLink: string;

  @ApiProperty({ description: 'Expiration date of the shortened link', type: Date })
  @IsOptional()
  @IsNotEmpty()
  expiredAt: Date;
}

