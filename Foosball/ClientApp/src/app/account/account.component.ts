import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.interface';
import { AuthenticationService } from '../services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
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

    this.subs.push(
      this.http.get<User[]>('/api/Player/GetUsers').subscribe(result => {
        result.forEach(function (user) {
          if (user.email == this.userEmail) {
            this.user = user;
          }
        }.bind(this));
      }, error => console.error(error))
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
