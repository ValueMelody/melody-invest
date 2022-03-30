import * as traderEnv from '../models/traderEnv'
import * as traderRes from './trader'

export interface UserToken {
  jwtToken: string;
  expiresIn: '12h' | '30d';
  userType: number;
}

export interface UserOverall {
  traderProfiles: traderRes.TraderProfile[];
  traderEnvs: traderEnv.Record[];
  email: string;
}
