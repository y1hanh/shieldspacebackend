import { Body, Controller, Injectable, Post, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';
import { AuthGuard } from 'src/auth/auth.guard';

export type Emotions = {
  user_input: string;
};

@Controller('model')
@UseGuards(AuthGuard)
export class EmotionsController {
  constructor(private readonly httpService: HttpService) {}

  @Post('emotions')
  async getEmo(@Body() userInput: Emotions): Promise<AxiosResponse<{}>> {
    const { data } = await axios.post(
      // 'http://localhost:8000/emotions',
      'http://data:8000/emotions',
      {
        user_input: userInput.user_input,
      },
    );
    return data;
  }
}
