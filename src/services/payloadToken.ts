import jwt from 'jsonwebtoken';

export interface PayloadToken extends jwt.JwtPayload {
  id: string;
  email: string;
  role: string;
}
