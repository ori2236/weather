import { HttpException, HttpStatus } from '@nestjs/common';

export class EnemyException extends HttpException {
  constructor(country_name: string) {
    super(
      {
        error: 'Enemy country',
        message: `Requests from ${country_name} are not allowed`,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
