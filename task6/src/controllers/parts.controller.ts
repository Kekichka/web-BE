import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { RandomPartDto } from '../models';
import { PartsService } from '../service'; 

@Controller('parts') 
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Get() 
  async getRandomPart(): Promise<RandomPartDto> {
    try {
      
      const otp = this.generateOTP();

      const randomPart = await this.partsService.getRandomPart();

      return {
        imageUrl: randomPart.imageUrl,
        otp,
        box: randomPart.box,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve random part');
    }
  }

  private generateOTP(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const otpLength = 6;
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
      otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
  }
}
