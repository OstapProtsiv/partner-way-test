import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { WeatherRepository } from './repositories/weather-repository';
import { ConfigService } from '@nestjs/config';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherEntity } from './entities/weather.entity';
import { of, throwError } from 'rxjs';
import { GetWeatherDto } from './dto/get-weather.dto';

describe('WeatherService', () => {
  let service: WeatherService;
  const httpServiceMock = {
    get: jest.fn(),
  };
  const weatherRepositoryMock = {
    saveWeather: jest.fn(),
    findOne: jest.fn(),
  };
  const configServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
        {
          provide: WeatherRepository,
          useValue: weatherRepositoryMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save weather data', async () => {
    const createWeatherDto: CreateWeatherDto = {
      latitude: 40.7128,
      longitude: -74.006,
      part: 'minutely',
    };

    const weatherData = {
      data: {
        sunrise: 1697285978,
      },
    };
    const mockWeatherEntity = new WeatherEntity();
    Object.assign(mockWeatherEntity, {
      ...createWeatherDto,
      data: JSON.stringify(weatherData.data),
    });
    jest.spyOn(configServiceMock, 'get').mockReturnValue('api-key');
    jest.spyOn(httpServiceMock, 'get').mockReturnValue(of(weatherData));
    jest
      .spyOn(weatherRepositoryMock, 'saveWeather')
      .mockReturnValue(Promise.resolve(mockWeatherEntity));

    const savedWeather = await service.saveWeather(createWeatherDto);

    expect(savedWeather).toEqual({
      ...mockWeatherEntity,
      data: JSON.parse(mockWeatherEntity.data),
    });
  });

  it('should handle errors', async () => {
    const createWeatherDto: CreateWeatherDto = {
      latitude: 40.7128,
      longitude: -74.006,
      part: 'minutely',
    };

    jest.spyOn(configServiceMock, 'get').mockReturnValue('api-key');
    jest
      .spyOn(httpServiceMock, 'get')
      .mockReturnValue(throwError(new Error('API error')));

    await expect(service.saveWeather(createWeatherDto)).rejects.toThrowError(
      'API error',
    );
  });

  describe('getWeatherData', () => {
    it('should get weather data by filter', async () => {
      const filter: GetWeatherDto = {
        latitude: 40.7128,
        longitude: -74.006,
        part: 'minutely',
      };

      const weatherData = {
        ...filter,
        data: JSON.stringify({
          sunrise: 1697285978,
          sunset: 1697327066,
          temp: 289.19,
          feels_like: 288.18,
          pressure: 1019,
          humidity: 51,
          uvi: 5.72,
          wind_speed: 6.17,
        }),
      };

      jest
        .spyOn(weatherRepositoryMock, 'findOne')
        .mockReturnValue(Promise.resolve(weatherData));

      const retrievedWeather = await service.getWeatherData(filter);

      expect(retrievedWeather).toEqual(weatherData);
    });
  });
});
