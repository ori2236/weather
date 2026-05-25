import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { Location, LocationResponseFromAPI } from './location.types';
import { ENEMY_COUNTRIES } from '../repositories/enemyExeption.repository';
import { EnemyException } from '../exceptions/enemy.exception';
import { LocationInterface } from './location.interface';

@Injectable()
export class LocationService implements LocationInterface {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private readonly logger = new Logger(LocationService.name);

  private async fetchLocation(ip: string): Promise<Location> {
    const locationApiKey = this.configService.get<string>('LOCATION_API_KEY');
    const locationApiBaseUrl = this.configService.get<string>(
      'LOCATION_API_BASE_URL',
    );

    if (!locationApiKey || !locationApiBaseUrl) {
      this.logger.error(
        "error in location, couldn't get the API key or base URL",
      );
      throw new Error('Location service');
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get<LocationResponseFromAPI>(locationApiBaseUrl, {
          params: { ip },
          headers: {
            Authorization: 'Bearer ' + locationApiKey,
          },
        }),
      );

      return {
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        country_name: response.data.country_name,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch location for ${ip}`);
      throw error;
    }
  }

  async getLocation(ip: string) {
    const cachedKey = 'L' + ip;
    const cachedLocation = await this.cacheManager.get<Location>(cachedKey);
    if (cachedLocation) {
      this.logger.log('cache hit in location');
      return cachedLocation;
    }
    this.logger.log('cache miss in location');

    const location = await this.fetchLocation(ip);

    if (ENEMY_COUNTRIES.includes(location.country_name)) {
      this.logger.error('blocked request from enemy country');
      throw new EnemyException(location.country_name);
    }

    await this.cacheManager.set(cachedKey, location);
    this.logger.log(`Location fetched successfully for ${ip}`);
    return location;
  }
}
