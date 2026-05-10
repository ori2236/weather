import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { CREW_MEMBERS } from '../repositories/mindYourOwnBusiness.repository';

@Injectable()
export class MindYourOwnBusinessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return !CREW_MEMBERS.includes(request.headers.name);
  }
}
