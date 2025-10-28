import { JwtPayload, SignOptions } from "jsonwebtoken";
import Jwt from "jsonwebtoken";

export const genarateTocken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const tocken = Jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return tocken;
};
