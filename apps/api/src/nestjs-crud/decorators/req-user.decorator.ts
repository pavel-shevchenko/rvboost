import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Default decorator to get the user from the request
 */
export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.raw?.user || request.user;
  },
);
