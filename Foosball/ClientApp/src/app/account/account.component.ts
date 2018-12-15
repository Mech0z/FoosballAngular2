import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/index';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent {
  public username: string;
  public checked: boolean;
  returnUrl: string;
  loginUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.username = this.authenticationService.checkLogin();
    this.checked = true;

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
    this.loginUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';

    if (this.username == null) {
      this.router.navigate([this.loginUrl]);
    }
  }
}
