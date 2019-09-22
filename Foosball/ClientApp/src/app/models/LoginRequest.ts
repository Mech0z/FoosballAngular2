export class LoginRequest {

  constructor(email: string, password: string, deviceName: string) {
    this.email = email;
    this.password = password;
    this.deviceName = deviceName;
    this.rememberMe = true;
  }

  email: string;
  password: string;
  rememberMe: Boolean;
  deviceName: string;
}

export class LoginResponse {
  expiryTime: Date;
  token: string;
  loginFailed: Boolean;
  roles: string[];
}
