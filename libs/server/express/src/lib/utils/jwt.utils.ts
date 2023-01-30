import jwt from "jsonwebtoken";

export async function signJwt(
  object: object,
  keyName: string,
  options?: jwt.SignOptions | undefined
) {
  return await jwt.sign(object, keyName,options);
}

export async function verifyJwt(
  token: string,
  keyName: string
) {
  try {
    const decoded = await jwt.verify(token, keyName);
    return {
      valid: true,
      expired: false,
      decoded,
      error: null
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: true,
      decoded: null,
      error: e
    };
  }
}
