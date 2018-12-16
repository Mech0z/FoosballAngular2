import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlayerService } from '../services/index';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { AuthenticationService } from '../services/index';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
})
export class ChangePasswordComponent {
  public password1: string;
  public password2: string;
  loading = false;
  public message: string;
  public username: string;
  loginUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loginUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
    this.username = this.authenticationService.checkLogin();
    if (this.username == null) {
      this.router.navigate([this.loginUrl]);
    }
  }
   
  valid() {
    if (this.password1 === this.password2) {
      return true;
    } else {
      return false;
    }
  }

  changepassword() {
    this.loading = true;
    var request = new ChangePasswordRequest(this.username, this.password1);
       
    if (!this.valid()) {
      this.message = "Passwords are not the same";
      this.loading = false;
      return;
    }

    if (this.password1.length < 6) {
      this.message = "Password needs to be at least 6 characters long";
      this.loading = false;
      return;
    }

    this.playerService.changePassword(request)
      .subscribe(
      () => {
        this.loading = false;
        this.password1 = "";
        this.password2 = "";
        this.message = "Success";
      },
      () => {
        this.message = "Request failed!";
        this.loading = false;
      });
  }
}
