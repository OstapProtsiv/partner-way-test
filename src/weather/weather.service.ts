import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherRepository } from './repositories/weather-repository';
import { ConfigService } from '@nestjs/config';
import { WeatherEntity } from './entities/weather.entity';
import { GetWeatherDto } from './dto/get-weather.dto';
import { firstValueFrom } from 'rxjs';
import { EnvKeys } from '../config/env-keys.enum';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly weatherRepository: WeatherRepository,
    private readonly configService: ConfigService,
  ) {}

  async saveWeather({
    latitude,
    part,
    longitude,
  }: CreateWeatherDto): Promise<WeatherEntity> {
    const weatherData = await firstValueFrom(
      this.httpService.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=${part}&appid=${this.configService.get(
          EnvKeys.OPEN_WEATHER_API_KEY,
        )}`,
      ),
    );

    const savedWeatherData = await this.weatherRepository.saveWeather({
      latitude,
      part,
      longitude,
      data: JSON.stringify(weatherData.data),
    });

    return { ...savedWeatherData, data: JSON.parse(savedWeatherData.data) };
  }

  async getWeatherData(filter: GetWeatherDto): Promise<WeatherEntity> {
    return await this.weatherRepository.findOne({
      where: filter,
    });
  }
}
