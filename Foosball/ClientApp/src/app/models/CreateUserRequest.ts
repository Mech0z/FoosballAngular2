export class CreateUserRequest {
  constructor(name: string, email: string, password: string) {
    this.username = name;
    this.email = email;
    this.password = password;
  }

  username: string;
  email: string;
  password: string;
}
