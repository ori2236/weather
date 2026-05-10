import { Injectable, PipeTransform } from '@nestjs/common';
import { TemperatureUnit } from './unitPipe.types';

@Injectable()
export class UnitPipe implements PipeTransform {
  transform(value: TemperatureUnit): TemperatureUnit {
    if (value === undefined) {
      return 'c';
    }

    if (value === 'c' || value === 'f') {
      return value;
    }

    throw new Error('unit must be c or f');
  }
}
