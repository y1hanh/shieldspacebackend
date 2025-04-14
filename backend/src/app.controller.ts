// src/app.controller.ts
import {
  Req,
  Controller,
  ExecutionContext,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Authentication } from '@nestjs-cognito/auth';
import { Request } from 'express';

@Controller('')
export class AppController {
  @Get('/')
  @Authentication()
  getProtectedRoute(@Req() request: Request) {
    // const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    return { message: 'This is a protected route!' };
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
