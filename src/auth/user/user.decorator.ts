import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator<unknown, ExecutionContext>(
  (data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.userId;
  },
);
