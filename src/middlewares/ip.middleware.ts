import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  private replaceLocalIp(ip: string) {
    return ip === '::1' ? '79.177.141.144' : ip;
  }

  use(request: Request, response: Response, next: NextFunction) {
    const cookieIp = request.cookies.ip;
    const ip = cookieIp ?? request.ip;
    const verifiedIp = this.replaceLocalIp(ip);

    if (!cookieIp) response.cookie('ip', verifiedIp);
    response.locals.ip = verifiedIp;

    next();
  }
}
