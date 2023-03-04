import { PayloadToken } from './token-info';
import { Request } from 'express';

export interface RequestPlus extends Request {
  info?: PayloadToken;
}
