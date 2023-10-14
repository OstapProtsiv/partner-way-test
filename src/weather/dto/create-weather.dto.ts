import { PickType } from '@nestjs/mapped-types';
import { WeatherEntity } from '../entities/weather.entity';

export class CreateWeatherDto extends PickType(WeatherEntity, [
  'latitude',
  'longitude',
  'part',
]) {}
