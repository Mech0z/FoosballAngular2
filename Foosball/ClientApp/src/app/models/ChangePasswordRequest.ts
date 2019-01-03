export class ChangePasswordRequest {
  constructor(email: string, password: string) {
    this.email = email;
    this.newPassword = password;
  }

  email: string;
  newPassword: string;
}
