import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { LocationService } from './location/location.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly locationService: LocationService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-location')
  async testLocation(@Query('ip') ip: string) {
    return this.locationService.getLocation("79.177.141.144");
  }
}
