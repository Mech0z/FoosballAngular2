import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/index';
import { HttpClient } from '@angular/common/http';
import { forEach } from '@angular/router/src/utils/collection';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
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
}
