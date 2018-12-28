import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, PlayerService } from '../services/index';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent {
  public user: User;
  public userEmail: string;
  public checked: boolean;
  returnUrl: string;
  loginUrl: string;
  newEmail1: string;
  newEmail2: string;
  errorMessage: string;
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private playerService: PlayerService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.userEmail = this.authenticationService.checkLogin();
    this.checked = true;

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
    this.loginUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';

    if (this.userEmail == null) {
      this.router.navigate([this.loginUrl]);
      return;
    }

    this.http.get<User[]>('/api/Player/GetUsers').subscribe(result => {

      result.forEach(function (user) {
        if (user.email == this.userEmail) {
          this.user = user;
        }
      }.bind(this));
      
    }, error => console.error(error));
  }

  changeEmail() {
    if (this.newEmail1 !== this.newEmail2) {
      this.errorMessage = "Emails are not equal";
      return;
    }

    this.loading = true;

    this.playerService.changeEmail(this.newEmail1).subscribe(result => {
      console.debug("Email changed");
      this.loading = false;
    }, error => {
      this.errorMessage = "Error in request: " + error.errorMessage;
      this.loading = false;
    });
  }
}
