import { TemperatureUnit } from '../pipes/unitPipe.types';
import { Weather } from './weather.types';

export interface WeatherInterface {
  getWeather(ip: string, unit: TemperatureUnit): Promise<Weather>;
}
