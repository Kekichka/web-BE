import { Controller, Get, Post, Param, Body, BadRequestException } from '@nestjs/common';
import { PartsService } from '../service';
import { SubmitPartDto } from '../models';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Get()
  getRandomPart() {
    return this.partsService.getRandomPart();
  }

  @Post('/:_id')
  submitPartText(@Param('id') id: string, @Body() submitPartDto: SubmitPartDto) {
    const { text, otp } = submitPartDto;
    const isOtpValid = this.partsService.verifyOtp(id, otp);

    this.partsService.removeOtp(otp);

    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP');
    }

    this.partsService.saveText(id, text);
    return { message: 'Text saved successfully' };
  }
}

