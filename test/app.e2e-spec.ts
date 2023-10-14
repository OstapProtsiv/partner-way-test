import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('App E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const dataSource = moduleFixture.get(DataSource);
    const database = `e2e_test_database`;

    try {
      await dataSource.query(`DROP DATABASE IF EXISTS ${database}`);
      await dataSource.query(`CREATE DATABASE ${database}`);
    } catch (err) {
      console.log('err', err);
    }
    const newDataSource = dataSource.setOptions({ database });
    await newDataSource.destroy();
    await newDataSource.initialize();
    await newDataSource.runMigrations();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST weather. Should save weather data', async () => {
    const input = {
      latitude: 33.44,
      longitude: -94.04,
      part: 'hourly',
    };

    const response = await request(app.getHttpServer())
      .post('/weather')
      .send(input);

    expect(response.body).toEqual({
      latitude: input.latitude,
      longitude: input.longitude,
      part: input.part,
      data: expect.any(Object),
      id: expect.any(Number),
    });
  });

  it('/POST weather. Should return bad request error when send same set of data', async () => {
    const input = {
      latitude: 33.44,
      longitude: -94.04,
      part: 'hourly',
    };

    await request(app.getHttpServer()).post('/weather').send(input);
    const secondResponse = await request(app.getHttpServer())
      .post('/weather')
      .send(input);

    expect(secondResponse.body).toEqual({
      message: 'Weather data with such parameters is already saved',
      statusCode: 400,
    });
  });

  it('/GET weather. Should return right object', async () => {
    const input = {
      latitude: 33.44,
      longitude: -94.04,
      part: 'hourly',
    };

    const secondResponse = await request(app.getHttpServer())
      .get('/weather')
      .query(input);

    expect(secondResponse.body).toEqual({
      sunrise: expect.any(Number),
      sunset: expect.any(Number),
      temp: expect.any(Number),
      feels_like: expect.any(Number),
      pressure: expect.any(Number),
      humidity: expect.any(Number),
      uvi: expect.any(Number),
      wind_speed: expect.any(Number),
    });
  });
});
