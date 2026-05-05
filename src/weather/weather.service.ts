import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getWeather(location: string) {
    const cachedKey = 'W' + location;
    const cachedWeather = await this.cacheManager.get(cachedKey);
    if (cachedWeather) return cachedWeather;

    const weatherApiKey = this.configService.get<string>('WEATHER_API_KEY');
    const weatherApiBaseUrl = this.configService.get<string>(
      'WEATHER_API_BASE_URL',
    );

    if (!weatherApiKey || !weatherApiBaseUrl) throw new Error('Weather service');

    const response = await lastValueFrom(
      this.httpService.get(weatherApiBaseUrl, {
        params: {
          key: weatherApiKey,
          q: location,
        },
      }),
    );

    const weather = response.data;
    await this.cacheManager.set(cachedKey, weather);
    return weather;
  }
}
