import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [HttpModule, CacheModule.register()],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
