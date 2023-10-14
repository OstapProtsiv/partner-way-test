import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WeatherEntity } from '../weather/entities/weather.entity';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: WeatherEntity | any) => {
        if (data) {
          if (data instanceof WeatherEntity) {
            const parsedJSON = JSON.parse(data.data).current;

            return {
              sunrise: parsedJSON.sunrise,
              sunset: parsedJSON.sunset,
              temp: parsedJSON.temp,
              feels_like: parsedJSON.feels_like,
              pressure: parsedJSON.pressure,
              humidity: parsedJSON.humidity,
              uvi: parsedJSON.uvi,
              wind_speed: parsedJSON.wind_speed,
            };
          }
          return data;
        }
      }),
    );
  }
}
