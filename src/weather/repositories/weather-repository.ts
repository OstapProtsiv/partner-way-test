import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WeatherEntity } from '../entities/weather.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WeatherRepository extends Repository<WeatherEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(WeatherEntity, dataSource.createEntityManager());
  }
  async saveWeather(input: Omit<WeatherEntity, 'id'>) {
    try {
      return await this.save(input);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          'Weather data with such parameters is already saved',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
}
