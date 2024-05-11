import { Injectable } from '@nestjs/common';

@Injectable()
export class PartsService {
  private readonly parts: any[] = [
    {
      imageUrl: 'https://example.com/image1.jpg',
      box: { x: 10, y: 20, width: 100, height: 200 }
    },
    {
      imageUrl: 'https://example.com/image2.jpg',
      box: { x: 30, y: 40, width: 150, height: 250 }
    },
  ];

  async getRandomPart(): Promise<any> {
    
    const randomIndex = Math.floor(Math.random() * this.parts.length);
    return this.parts[randomIndex];
  }
}
