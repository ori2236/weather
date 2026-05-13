import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Weather } from '../weather/weather.types';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    
    const timeBefore = Date.now();

    return next.handle().pipe(
      tap((weather: Weather) => {
        const timeTook = Date.now() - timeBefore;
        const latitude = weather.location.latitude;
        const longitude = weather.location.longitude;
        const country_name = weather.location.country_name;

        const ip = response.locals.ip;
        const location = `${country_name} (${latitude},${longitude})`;

        this.logger.log(
          `fetching weather took ${timeTook}ms for ip ${ip} locate at ${location}`,
        );
      }),
      map((weather: Weather) => weather.current),
    );
  }
}
