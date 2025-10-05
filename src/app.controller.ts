import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/api/api-docs')
  getHello() {
    return {
      message:
        'Welcome to Career Buzz AI API. Visit /api/api-docs for documentation.',
    };
  }

  @Get('health')
  getHealth() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }
}
