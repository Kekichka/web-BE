import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDoc, Capital, CapitalDoc, Flag, FlagDoc, Language, LanguageDoc, Countries, CountriesDoc, Languages } from '../schema';
import { UserService } from './user.service';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<QuestionDoc>,
    @InjectModel(Capital.name) private readonly capitalModel: Model<CapitalDoc>,
    @InjectModel(Flag.name) private readonly flagModel: Model<FlagDoc>,
    @InjectModel(Language.name) private readonly languageModel: Model<LanguageDoc>,
    @InjectModel(Countries.name) private readonly countriesModel: Model<CountriesDoc>,
    @InjectModel(Languages.name) private readonly languagesModel: Model<LanguageDoc>,
    private readonly userService: UserService,
  ) {}

  async getQuizQuestion(quizType: string): Promise<any> {
    const isValidQuizType = ['capital', 'flag', 'language'].includes(quizType);
    if (!isValidQuizType) {
      throw new Error('Invalid quiz type');
    }
    
    const questionData = await this.questionModel.findOne({ quizType }).exec();
    
    if (!questionData) {
      throw new Error('No question found for the specified quiz type');
    }
    
    let options: string[] = [];
    let response: string;
    let correspondingCountry: string;
    let correspondingCountryForFlag: string;
    let correspondingLanguage: string;
    
    switch (quizType) {
      case 'capital':
        const randomCapital = await this.capitalModel.findOne().skip(Math.floor(Math.random() * await this.capitalModel.countDocuments())).exec();
        response = randomCapital.capital;
        correspondingCountry = randomCapital.country;
        options = [correspondingCountry];
        const randomCountriesForCapital = await this.countriesModel.aggregate([{ $sample: { size: 3 } }]);
        options = options.concat(randomCountriesForCapital.map(country => country.country));
        break;
      case 'flag':
        const randomFlag = await this.flagModel.findOne().skip(Math.floor(Math.random() * await this.flagModel.countDocuments())).exec();
        response = randomFlag.flag;
        correspondingCountryForFlag = randomFlag.reply; 
        options = [correspondingCountryForFlag];
        const randomCountriesForFlag = await this.countriesModel.aggregate([{ $sample: { size: 3 } }]);
        options = options.concat(randomCountriesForFlag.map(country => country.country));
        break;
      case 'language':
        const randomLanguage = await this.languageModel.findOne().skip(Math.floor(Math.random() * await this.languageModel.countDocuments())).exec();
        response = randomLanguage.text;
        correspondingLanguage = randomLanguage.language; 
        options = [correspondingLanguage];
        const randomLanguages = await this.languageModel.aggregate([{ $sample: { size: 3 } }]);
        options = options.concat(randomLanguages.map(language => language.language));
        break;
    }
    
    options = this.shuffle(options);
    
    return {
      question: questionData.question,
      options,
      response,
      correspondingCountry, 
      correspondingCountryForFlag, 
      correspondingLanguage 
    };
  }

  async completeQuiz(token: string): Promise<void> {
    const user = await this.userService.findByToken(token);
    if (!user) {
      throw new Error('User not found');
    }
    console.log('User found:', user);
    await this.userService.updateUserXP(user, 2);
    console.log('User XP updated');
  }
  

  shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
