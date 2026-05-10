import {
  Controller,
  Get,
  Ip,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { WeatherService } from './weather/weather.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { EnemyExceptionFilter } from './filters/enemyException.filter';
import { UnitPipe } from './pipes/unitPipe.pipe';
import type { TemperatureUnit } from './pipes/unitPipe.types';
import { MindYourOwnBusinessGuard } from './guards/mindYourOwnBusiness.guard';

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

  @UseGuards(MindYourOwnBusinessGuard)
  @UseInterceptors(LoggingInterceptor)
  @UseFilters(EnemyExceptionFilter)
  @Get('weather')
  async getWeather(
    @Query('ip') ip: string,
    @Query('unit', UnitPipe) unit: TemperatureUnit,
  ) {
    return this.weatherService.getWeather(ip, unit);
  }
}
