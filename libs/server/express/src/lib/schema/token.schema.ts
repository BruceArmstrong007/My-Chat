import { number, object, string, TypeOf } from 'zod';

export const tokenPayloadParser = object({
  id: number(),
  username: string()
});

export type TokenPayload = TypeOf<typeof tokenPayloadParser>;
