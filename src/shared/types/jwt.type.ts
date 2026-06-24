export interface AccessTokenPayloadCreate {
  userId: number;
  deviceId: number;
  roleId: number;
  roleName: String;
}
export interface AccessTokenPayload extends AccessTokenPayloadCreate {
  exp: number;
  iat: number;
}
export interface RefreshTokenPayloadCreate {
  userId: number;
}
export interface RefreshTokenPayload extends RefreshTokenPayloadCreate {
  exp: number;
  iat: number;
}
