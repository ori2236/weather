import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WeatherResponse } from '../weather/weather.types';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const ip = request.query.ip;

    const timeBefore = Date.now();

    return next.handle().pipe(
      tap((weather: WeatherResponse) => {
        const timeTook = Date.now() - timeBefore;
        const latitude = weather.location.latitude;
        const longitude = weather.location.longitude;
        const location = `${latitude},${longitude}`;

        this.logger.log(
          `fetching weather took ${timeTook}ms for ip ${ip} and the location is ${location}`,
        );
      }),
    );
  }
}
