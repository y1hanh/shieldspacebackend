// src/app.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';

@Controller('')
export class AppController {
  @Get('/')
  getHello(): string {
    return 'Hello World!';
  }
}
