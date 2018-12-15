import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlayerService } from '../services/index';

@Component({
  selector: 'app-requestpassword',
  templateUrl: './requestpassword.component.html',
})
export class RequestPasswordComponent {
  public email: string;
  loading = false;
  loginUrl: string;
  public errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    this.loginUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';   
  }

  requestpassword() {
    this.loading = true;
    this.playerService.requestNewPassword(this.email)
      .subscribe(
        data => {
          this.router.navigate([this.loginUrl]);
        },
        error => {
          this.errorMessage = "Request failed!";
          this.loading = false;
        });
  }
}
