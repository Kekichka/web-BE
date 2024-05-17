import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Part } from '../schema';

@Injectable()
export class PartsService {
  private partAccessTokens: { [key: string]: string } = {};

  constructor(@InjectModel(Part.name) private partModel: Model<Part>) {}

  async getRandomPart(): Promise<any> {
    // Generate a random part with an OTP
    const part = {
      imageUrl: 'http://example.com/image.jpg',
      otp: Math.random().toString(36).substring(7),
      box: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    };
    this.partAccessTokens[part.otp] = part.otp;  // Using OTP as key for simplicity
    return part;
  }

  verifyOtp(partId: string, otp: string): boolean {
    return this.partAccessTokens[otp] === partId;
  }

  removeOtp(otp: string): void {
    delete this.partAccessTokens[otp];
  }

  saveText(partId: string, text: string): void {
    // Logic to save text associated with the partId
    // This can be an update to the Part document in the database
    console.log(`Saving text for part ${partId}: ${text}`);
  }
}
