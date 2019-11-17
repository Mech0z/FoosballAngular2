export class ChangeUserPasswordRequest {
    constructor(userEmail: string, newPassword: string) {
      this.userEmail = userEmail;
      this.newPassword = newPassword;
    }

    userEmail: string;
    newPassword: string;
  }