import { Location } from './location.types';

export interface LocationInterface {
  getLocation(ip: string): Promise<Location>;
}
