import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { RandomPartDto } from '../models'; // Import the RandomPartDto
import { PartsService } from '../service'; // Import the PartsService

@Controller('parts') // Corrected to 'parts'
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Get() // Removed redundant route path
  async getRandomPart(): Promise<RandomPartDto> {
    try {
      // Generate a random OTP
      const otp = this.generateOTP();

      // Retrieve a random part
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
    // Generate a random string as OTP (you can use any method you prefer)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const otpLength = 6;
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
      otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
  }
}
