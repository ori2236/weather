import { ExecutionContext } from '@nestjs/common';
import { MindYourOwnBusinessGuard } from './mindYourOwnBusiness.guard';
import { CREW_MEMBERS } from '../repositories/mindYourOwnBusiness.repository';

describe('MindYourOwnBusinessGuard', () => {
  let guard: MindYourOwnBusinessGuard;

  beforeEach(() => {
    guard = new MindYourOwnBusinessGuard();
  });

  const mockContext = (headers: Record<string, string>) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
    }) as ExecutionContext;

  it('blocks request when name is a crew member', () => {
    const context = mockContext({ name: CREW_MEMBERS[0] });

    expect(guard.canActivate(context)).toBe(false);
  });

  it('allows request when name is not a crew member', () => {
    const context = mockContext({ name: 'alma' });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows request when name header is missing', () => {
    const context = mockContext({});

    expect(guard.canActivate(context)).toBe(true);
  });
});
