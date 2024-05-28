import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PartAccessTokenDoc, Parts, PartsDoc } from '../schema';
import { PartAccessToken } from '../schema';
import { Pictures, PicturesDoc } from '../schema';
import axios from 'axios';
import Jimp from 'jimp';

@Injectable()
export class PartsService {
  constructor(
    @InjectModel(Parts.name)
    private readonly partsModel: Model<PartsDoc>,
    @InjectModel(PartAccessToken.name)
    private readonly partAccessTokenModel: Model<PartAccessTokenDoc>,
    @InjectModel(Pictures.name)
    private readonly picturesModel: Model<PicturesDoc>,
  ) {}

  
  async generateRandomPartFromLink(imageUrl: string, picturesId: string): Promise<any> {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');
      const image = await Jimp.read(imageBuffer);

      const randomPart = {
        imageUrl,
        picturesId,
        otp: await this.generateOTP(),
        box: {
          x: Math.random() * image.bitmap.width,
          y: Math.random() * image.bitmap.height,
          width: Math.random() * image.bitmap.width,
          height: Math.random() * image.bitmap.height,
        },
      };

      const savedPart = await this.partsModel.create(randomPart);

      const accessToken = {
        key: savedPart.otp,
        partId: savedPart._id.toString(),
      };

      await this.partAccessTokenModel.create(accessToken);

      return {
        imageUrl: savedPart.imageUrl,
        otp: savedPart.otp,
        box: savedPart.box,
      };
    } catch (error) {
      console.error(`Error generating random part from link: ${error.message}`);
      throw new BadRequestException('Failed to generate random part from link');
    }
  }

  async generateOTP(): Promise<string> {
    const length = 6;
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let OTP = '';
    for (let i = 0; i < length; i++) {
      OTP += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return OTP;
  }

  async getRandomPart(): Promise<any> {
    try {
      const count = await this.picturesModel.countDocuments();
      if (count === 0) {
        throw new BadRequestException('No pictures found');
      }

      const randomIndex = Math.floor(Math.random() * count);
      const randomPicture = await this.picturesModel.findOne().skip(randomIndex).exec();

      if (!randomPicture) {
        throw new BadRequestException('No picture found');
      }

      return await this.generateRandomPartFromLink(randomPicture.url, randomPicture._id.toString());
    } catch (err) {
      console.error(`Failed to generate part: ${err.message}`);
      throw new BadRequestException('Failed to generate part from provided link');
    }
  }

  async verifyOtpAndDelete(partId: string, otp: string): Promise<void> {
    const accessToken = await this.partAccessTokenModel.findOne({ partId, key: otp }).exec();
    if (!accessToken) {
      throw new NotFoundException('Invalid OTP or Part ID');
    }
    await this.partAccessTokenModel.deleteOne({ _id: accessToken._id }).exec();
  }
}