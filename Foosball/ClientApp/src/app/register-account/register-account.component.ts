import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../services';
import { CreateUserRequest } from '../models/CreateUserRequest';

@Component({
  selector: 'app-register-account',
  moduleId: module.id,
  templateUrl: 'register-account.component.html'
})

export class RegisterAccountComponent implements OnInit {
  name: string;
  nameError: string;
  username: string;
  password: string;
  password2: string;
  errorMessage: string;
  passwordError: string;
  loading = false;

  constructor(
    private playerService: PlayerService
  ) { }

  ngOnInit() {
  }

  nameIsValid() {
  if (this.name == null) {
    return false;
  }

  if (this.name.length < 6) {
    this.nameError = 'Minimum name length is 6';
    return false;
  }
  return true;
  }

  userIsValid() {
    if (this.username == null) {
      return false;
    }
    return true;
  }

  passwordIsValid() {
    if (this.password == null) {
      this.passwordError = 'Password is required';
      return false;
    } else if (this.password !== this.password2) {
      this.passwordError = 'Passwords are not identical';
      return false;
    } else if (this.password.length < 6) {
      this.passwordError = 'Minimum password length is 6';
      return false;
    }
    this.passwordError = '';
    return true;
  }

  createaccount() {
    this.loading = true;
    const request = new CreateUserRequest(this.name, this.username, this.password);
    this.playerService.createUser(request).subscribe(() => {
      this.errorMessage = 'User created';
      this.loading = false;
    }, error => {
      this.errorMessage = 'Failed ' + error.errorMessage;
      this.loading = false;
    });
  }
}
