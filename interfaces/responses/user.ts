export interface UserToken {
  jwtToken: string;
  expiresIn: '12h' | '30d';
  userType: number;
}
