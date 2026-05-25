import { BadRequestException } from '@nestjs/common';
import { UnitPipe } from './unitPipe.pipe';

describe('UnitPipe', () => {
  let pipe: UnitPipe;

  beforeEach(() => {
    pipe = new UnitPipe();
  });

  it('return c when value is undefined', () => {
    expect(pipe.transform(undefined)).toBe('c');
  });

  it('return c for c', () => {
    expect(pipe.transform('c')).toBe('c');
  });

  it('return f for f', () => {
    expect(pipe.transform('f')).toBe('f');
  });

  it('throws on invalid value', () => {
    expect(() => pipe.transform('x')).toThrow(BadRequestException);
  });
});
