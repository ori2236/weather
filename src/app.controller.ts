import { Controller, Get, Ip, Query, UseFilters, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { WeatherService } from './weather/weather.service';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { EnemyExceptionFilter } from './filters/enemy-exception.filter';

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

  @UseInterceptors(LoggingInterceptor)
  @UseFilters(EnemyExceptionFilter)
  @Get('weather')
  async testLocation(@Query('ip') ip: string) {
    return this.weatherService.getWeather(ip);
  }
}
