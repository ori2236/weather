export interface LocationCoordinanates {
  latitude: number;
  longitude: number;
}

export interface LocationResponseFromAPI extends LocationCoordinanates {
  ip: string;
  country_code: string;
  country_name: string;
  region_name: string;
  city_name: string;
  zip_code: string;
  time_zone: string;
  asn: string;
  as: string;
  is_proxy: boolean;
}
