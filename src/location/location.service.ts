import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { LocationResponse } from './location.types';

@Injectable()
export class LocationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private readonly logger = new Logger(LocationService.name);

  async getLocation(ip: string): Promise<LocationResponse> {
    const cachedKey = 'L' + ip;
    const cachedLocation =
      await this.cacheManager.get<LocationResponse>(cachedKey);
    if (cachedLocation) {
      this.logger.log('cache hit in location');
      return cachedLocation;
    }
    this.logger.log('cache miss in location');

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
        this.httpService.get<LocationResponse>(locationApiBaseUrl, {
          params: { ip },
          headers: {
            Authorization: 'Bearer ' + locationApiKey,
          },
        }),
      );

      const location = response.data;
      await this.cacheManager.set(cachedKey, location);
      this.logger.log(`Location fetched successfully for ${ip}`);
      return location;
    } catch (error) {
      this.logger.error(`Failed to fetch location for ${ip}`);
      throw error;
    }
  }
}
