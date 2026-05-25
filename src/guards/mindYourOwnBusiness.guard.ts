import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { CREW_MEMBERS } from '../repositories/mindYourOwnBusiness.repository';
import type { Request } from 'express';

@Injectable()
export class MindYourOwnBusinessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
     const request = context.switchToHttp().getRequest<Request>();
     const name = request.headers.name;

     if (typeof name !== 'string') {
       return true;
     }
     
    return !CREW_MEMBERS.includes(name);
  }
}

