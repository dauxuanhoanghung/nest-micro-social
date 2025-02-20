/**
 * Token payload DTO
 *
 * @example {
 *  sub: 1, // userId
 *  email: 'admin@example.com',
 *  jit: uuid.v4(), // uuid for limit token in case logout any devices
 *  ... // other information like roles, deviceId, expiresAt, etc
 * }
 */
export class TokenPayload {
  sub: string;
  email: string;
  roles?: string[];
  [key: string]: any;
}
