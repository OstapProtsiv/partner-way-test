import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { GetWeatherDto } from './dto/get-weather.dto';
import { FormatResponseInterceptor } from '../interceptors/format-get-response.interceptor';

@Controller('weather')
@UsePipes(new ValidationPipe())
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  create(@Body() createWeatherData: CreateWeatherDto) {
    return this.weatherService.saveWeather(createWeatherData);
  }

  @UseInterceptors(FormatResponseInterceptor)
  @Get()
  findOne(@Query() filterInput: GetWeatherDto) {
    return this.weatherService.getWeatherData(filterInput);
  }
}
