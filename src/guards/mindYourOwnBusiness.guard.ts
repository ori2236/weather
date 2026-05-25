import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { CREW_MEMBERS } from '../repositories/mindYourOwnBusiness.repository';
import type { Request } from 'express';

@Injectable()
export class MindYourOwnBusinessGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const name = request.headers.name;

    const isCrewMember =
      typeof name === 'string' && CREW_MEMBERS.includes(name);

    return !isCrewMember;
  }
}
