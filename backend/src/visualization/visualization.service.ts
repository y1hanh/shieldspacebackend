import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export type VisualizationResponse = {
  label: string;
  'count(label)': string;
};

@Injectable()
export class VisualizationService {
  constructor(private dataSource: DataSource) {}

  async getBullyingCount(): Promise<VisualizationResponse[]> {
    const query = `
      select label, count(label) from shieldspace.cb_multi_labeled_balanced where label != "not_cyberbullying" group by label;
    `;
    const result = await this.dataSource.query(query);
    return result;
  }
}
