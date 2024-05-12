import { Injectable } from '@nestjs/common';

@Injectable()
export class PartsService {
  async getRandomPart(): Promise<any> {
    const randomPart = {
      imageUrl: 'https://example.com/random-image.jpg',
      box: {
        x: this.generateRandomNumber(0, 100), 
        y: this.generateRandomNumber(0, 100), 
        width: this.generateRandomNumber(50, 200), 
        height: this.generateRandomNumber(50, 200), 
      }
    };
    return randomPart;
  }

  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  
}
