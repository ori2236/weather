import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TemperatureUnit } from './unitPipe.types';

@Injectable()
export class UnitPipe implements PipeTransform<
  string | undefined,
  TemperatureUnit
> {
  transform(value: string | undefined): TemperatureUnit {
    if (value === undefined) {
      return 'c';
    }

    if (value === 'c' || value === 'f') {
      return value;
    }

    throw new BadRequestException('unit must be c or f');
  }
}
