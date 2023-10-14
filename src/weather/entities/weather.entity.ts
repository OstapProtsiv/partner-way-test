import { Transform } from 'class-transformer';
import { IsJSON, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'weather' })
// all 3 values must be unique
@Index('UQ_weather_unique_input', ['latitude', 'longitude', 'part'], {
  unique: true,
})
export class WeatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @Min(-90, { message: 'Latitude must be between -90 and 90' })
  @Max(90, { message: 'Latitude must be between -90 and 90' })
  @Column({ type: 'float' })
  latitude: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @Min(-180, { message: 'Longitude must be between -180 and 180' })
  @Max(180, { message: 'Longitude must be between -180 and 180' })
  @Column({ type: 'float' })
  longitude: number;

  @IsString()
  @IsNotEmpty()
  @Column()
  part: string;

  @IsJSON()
  @Column('jsonb')
  data: string;
}
