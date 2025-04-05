import { Body, Controller, Injectable, Post, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { AuthGuard } from 'src/auth/auth.guard';

export type Emotions = {
  transformer_emotions: string;
  nrc_emotions: string;
};

@Controller()
export class EmotionsController {
  constructor(private readonly httpService: HttpService) {}

  @UseGuards(AuthGuard)
  @Post('emotions')
  async getEmo(@Body() userInput: Emotions): Promise<AxiosResponse<Emotions>> {
    const { data } = await this.httpService.axiosRef.post(
      'http://localhost:8000/emotions',
      {
        transformer_emotions: userInput.transformer_emotions,
        nrc_emotions: userInput.nrc_emotions,
      },
    );
    return data;
  }
}
