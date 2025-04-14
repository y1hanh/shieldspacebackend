import { Controller, Get } from '@nestjs/common';
import {
  VisualizationResponse,
  VisualizationService,
} from './visualization.service';

@Controller()
export class VisualizationController {
  constructor(private readonly visualizationService: VisualizationService) {}

  @Get('visualization')
  async getAllData(): Promise<VisualizationResponse[]> {
    console.log('getAllData');
    return this.visualizationService.getBullyingCount();
  }
}
