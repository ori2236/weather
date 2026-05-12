import {
  Controller,
  Get,
  Ip,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WeatherService } from './weather/weather.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { EnemyExceptionFilter } from './filters/enemyException.filter';
import { UnitPipe } from './pipes/unitPipe.pipe';
import type { TemperatureUnit } from './pipes/unitPipe.types';
import { MindYourOwnBusinessGuard } from './guards/mindYourOwnBusiness.guard';

@Controller()
export class AppController {
  constructor(private readonly weatherService: WeatherService) {}

  @UseGuards(MindYourOwnBusinessGuard)
  @UseInterceptors(LoggingInterceptor)
  @UseFilters(EnemyExceptionFilter)
  @Get('weather')
  async getWeather(
    @Ip() ip: string,
    @Query('unit', UnitPipe) unit: TemperatureUnit,
  ) {
    return this.weatherService.getWeather(ip, unit);
  }
}
