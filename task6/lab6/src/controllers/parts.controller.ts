import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PartsService } from '../service/parts.service';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Get('/')
  async getRandomPart(): Promise<any> {
    try {
      const randomPart = await this.partsService.getRandomPart();
      return randomPart;
    } catch (error) {
      console.error(`Error generating part: ${error.message}`);
      throw new BadRequestException('Failed to generate part');
    }
  }

  @Post('/:id')
  async verifyOtpAndDelete(
    @Param('id') partId: string,
    @Body() body: { text: string, otp: string },
  ): Promise<void> {
    try {
      await this.partsService.verifyOtpAndDelete(partId, body.otp);
    } catch (error) {
      console.error(`Error verifying OTP: ${error.message}`);
      throw new BadRequestException(error.message || 'Failed to verify OTP');
    }
  }
}
