import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { WeatherService } from './weather/weather.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly weatherService: WeatherService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-location')
  async testLocation(@Query('location') location: string) {
    return this.weatherService.getWeather('32.0809,33.78123');
  }
}
