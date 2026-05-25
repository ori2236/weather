import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { LocationModule } from '../location/location.module';
import { WeatherService } from './weather.service';

@Module({
  imports: [HttpModule, CacheModule.register(), LocationModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
