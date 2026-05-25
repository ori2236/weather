import {
  Controller,
  Get,
  Query,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';
import { EnemyExceptionFilter } from '../filters/enemyException.filter';
import { MindYourOwnBusinessGuard } from '../guards/mindYourOwnBusiness.guard';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { unitSchema, type TemperatureUnit } from '../pipes/unitPipe.types';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @UseGuards(MindYourOwnBusinessGuard)
  @UseInterceptors(LoggingInterceptor)
  @UseFilters(EnemyExceptionFilter)
  @Get()
  async getWeather(
    @Query('unit', new ZodValidationPipe(unitSchema)) unit: TemperatureUnit,
    @Res({ passthrough: true }) response: Response,
  ) {
    const ip = response.locals.ip;
    return this.weatherService.getWeather(ip, unit);
  }
}
