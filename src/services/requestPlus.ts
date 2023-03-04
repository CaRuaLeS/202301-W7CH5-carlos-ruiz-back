import { PayloadToken } from './payloadToken';
import { Request } from 'express';

export interface RequestPlus extends Request {
  dataPlus?: PayloadToken;
}
