import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LocationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getLocation(ip: string) {
    const cachedLocation = await this.cacheManager.get(ip);
    if (cachedLocation) return cachedLocation;

    const locationApiKey = this.configService.get<string>('LOCATION_API_KEY');
    const locationApiBaseUrl = this.configService.get<string>('LOCATION_API_BASE_URL');

    if (!locationApiKey || !locationApiBaseUrl) throw new Error;

    const response = await lastValueFrom(
      this.httpService.get(locationApiBaseUrl, {
        params: { ip },
        headers: {
          Authorization: 'Bearer ' + locationApiKey,
        },
      }),
    );

    console.log(response.data);

    const location = response.data;
    await this.cacheManager.set(ip, location);
    return location;
  }
}
