import { Location } from '../location/location.types';

interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface WeatherBase {
  last_updated_epoch: number;
  last_updated: string;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
  short_rad: number;
  diff_rad: number;
  dni: number;
  gti: number;
}

export interface WeatherCurrent extends WeatherBase {
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
}

export interface WeatherByUnit extends WeatherBase {
  temp: number;
  feelslike: number;
  windchill: number;
  heatindex: number;
  dewpoint: number;
}

export interface Weather {
  location: Location;
  current: WeatherByUnit;
}

export interface WeatherApiResponse {
  current: WeatherCurrent;
}

