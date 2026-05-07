export interface Location {
  latitude: number;
  longitude: number;
  country_name: string;
}

export interface LocationResponseFromAPI extends Location {
  ip: string;
  country_code: string;
  region_name: string;
  city_name: string;
  zip_code: string;
  time_zone: string;
  asn: string;
  as: string;
  is_proxy: boolean;
}
