import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  username: string;
  password: string;
  loading = false;
  returnUrl: string;
  public errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
  }

  userIsValid() {
    if (this.username == null) {
      return false;
    }
    return true;
  }

  passwordIsValid() {
    if (this.password == null) {
      return false;
    }
    return true;
  }

  login() {
    this.loading = true;
    if (this.username == null) {
      return;
    }
    this.username = this.username.trim();
    this.username = this.username.toLowerCase();
    this.authenticationService.login(this.username, this.password)
      .subscribe(
      data => {
        if (data.loginFailed) {
          this.loading = false;
          this.errorMessage = 'Login failed!';
        } else {
          this.router.navigate([this.returnUrl]);
          this.errorMessage = null;
        }
        },
      error => {
          this.errorMessage = 'Request failed!';
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
