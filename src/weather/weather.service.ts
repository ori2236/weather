import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { LocationService } from '../location/location.service';
import {
  Weather,
  WeatherApiResponse,
  WeatherByUnit,
  WeatherCurrent,
} from './weather.types';
import type { TemperatureUnit } from '../pipes/unitPipe.types';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly locationService: LocationService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private filterByTemperature(
    weather: WeatherCurrent,
    unit: TemperatureUnit,
  ): WeatherByUnit {
    const isF = unit === 'f';

    const {
      temp_c,
      temp_f,
      feelslike_c,
      feelslike_f,
      windchill_c,
      windchill_f,
      heatindex_c,
      heatindex_f,
      dewpoint_c,
      dewpoint_f,
      ...weatherBase
    } = weather;

    return {
      ...weatherBase,
      temp: isF ? temp_f : temp_c,
      feelslike: isF ? feelslike_f : feelslike_c,
      windchill: isF ? windchill_f : windchill_c,
      heatindex: isF ? heatindex_f : heatindex_c,
      dewpoint: isF ? dewpoint_f : dewpoint_c,
    };
  }

  private readonly logger = new Logger(WeatherService.name);

  async getWeather(ip: string, unit: TemperatureUnit): Promise<Weather> {
    const location = await this.locationService.getLocation(ip);
    const latitude = location.latitude;
    const longitude = location.longitude;

    const cachedKey = `W${latitude},${longitude}`;
    const cachedWeather =
      await this.cacheManager.get<WeatherCurrent>(cachedKey);

    if (cachedWeather) {
      this.logger.log('cache hit in weather');
      const weatherCurrent = this.filterByTemperature(cachedWeather, unit);
      return { current: weatherCurrent, location };
    }

    this.logger.log('cache miss in weather');

    const weatherApiKey = this.configService.get<string>('WEATHER_API_KEY');
    const weatherApiBaseUrl = this.configService.get<string>(
      'WEATHER_API_BASE_URL',
    );

    if (!weatherApiKey || !weatherApiBaseUrl) {
      this.logger.error(
        "error in weather, couldn't get the API key or base URL",
      );
      throw new Error('Weather service');
    }
    try {
      const response = await lastValueFrom(
        this.httpService.get<WeatherApiResponse>(weatherApiBaseUrl, {
          params: {
            key: weatherApiKey,
            q: `${latitude},${longitude}`,
          },
        }),
      );

      const weatherCurrent = response.data.current;
      await this.cacheManager.set(cachedKey, weatherCurrent);

      const weatherWithUnits = this.filterByTemperature(weatherCurrent, unit);
      const weather: Weather = { current: weatherWithUnits, location };
      this.logger.log(`Weather fetched successfully for ${ip}`);
      return weather;
    } catch (error) {
      this.logger.error(`Failed to fetch weather for ${ip}`);
      throw error;
    }
  }
}
