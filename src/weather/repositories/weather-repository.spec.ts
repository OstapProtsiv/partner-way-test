import { WeatherRepository } from './weather-repository';
import { WeatherEntity } from '../entities/weather.entity';
import { DataSource } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';

describe('WeatherRepository', () => {
  let service: WeatherRepository;

  const mockDataSource: DataSource = {
    createEntityManager: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherRepository,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<WeatherRepository>(WeatherRepository);
  });

  describe('saveWeather', () => {
    it('should save weather data', async () => {
      const saveMock = jest
        .spyOn(service, 'save')
        .mockResolvedValue({} as WeatherEntity);

      const inputWeatherData = {
        latitude: 40.7128,
        longitude: -74.006,
        part: 'minutely',
        data: JSON.stringify({
          sunrise: 1697285978,
        }),
      };

      const result = await service.saveWeather(inputWeatherData);

      expect(saveMock).toHaveBeenCalledWith(inputWeatherData);
      expect(result).toEqual({} as WeatherEntity);
    });

    it('should handle unique constraint violation', async () => {
      jest.spyOn(service, 'save').mockRejectedValueOnce({ code: '23505' });

      const inputWeatherData = {
        latitude: 40.7128,
        longitude: -74.006,
        part: 'minutely',
        data: JSON.stringify({
          sunrise: 1697285978,
        }),
      };

      try {
        await service.saveWeather(inputWeatherData);
      } catch (error) {
        console.log(error);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(
          'Weather data with such parameters is already saved',
        );
      }
    });

    it('should handle other errors', async () => {
      jest
        .spyOn(service, 'save')
        .mockRejectedValue(new Error('Some unexpected error'));

      const inputWeatherData = {
        latitude: 40.7128,
        longitude: -74.006,
        part: 'minutely',
        data: JSON.stringify({
          sunrise: 1697285978,
        }),
      };

      try {
        await service.saveWeather(inputWeatherData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Some unexpected error');
      }
    });
  });
});
