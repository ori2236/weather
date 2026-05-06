import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { LocationService } from '../location/location.service';
import { WeatherResponse } from './weather.types';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly locationService: LocationService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private readonly logger = new Logger(WeatherService.name);

  async getWeather(ip: string): Promise<WeatherResponse> {
    const location = await this.locationService.getLocation(ip);
    const latitude = location.latitude;
    const longitude = location.longitude;

    const cachedKey = `W${latitude},${longitude}`;
    const cachedWeather = await this.cacheManager.get<WeatherResponse>(cachedKey);
    if (cachedWeather) {
      this.logger.log('cache hit in weather');
      return cachedWeather;
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
        this.httpService.get<WeatherResponse>(weatherApiBaseUrl, {
          params: {
            key: weatherApiKey,
            q: `${latitude},${longitude}`,
          },
        }),
      );

      const weather = response.data;
      await this.cacheManager.set(cachedKey, weather);
      this.logger.log(`Weather fetched successfully for ${ip}`);
      return weather;
    } catch (error) {
      this.logger.error(`Failed to fetch weather for ${ip}`);
      throw error;
    }
  }
}
