export class ChangeEmailRequest {
  constructor(email: string) {
    this.newEmail = email;
  }

  newEmail: string;
}
