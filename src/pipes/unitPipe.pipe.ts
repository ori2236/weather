import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TemperatureUnit, unitSchema } from './unitPipe.types';

@Injectable()
export class UnitPipe implements PipeTransform<
  string | undefined,
  TemperatureUnit
> {
  transform(value: string | undefined): TemperatureUnit {
    const result = unitSchema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException('unit must be c or f');
    }

    return result.data;
  }
}
