import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [HttpModule, CacheModule.register(), LocationModule],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
