import { PickType } from '@nestjs/mapped-types';
import { WeatherEntity } from '../entities/weather.entity';

export class GetWeatherDto extends PickType(WeatherEntity, [
  'latitude',
  'longitude',
  'part',
]) {}
