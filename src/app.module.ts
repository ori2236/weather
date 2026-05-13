import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { LocationModule } from './location/location.module';
import { WeatherModule } from './weather/weather.module';
import { IpMiddleware } from './middlewares/ip.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LocationModule,
    WeatherModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpMiddleware).forRoutes('weather');
  }
}
