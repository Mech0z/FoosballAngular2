import { Component, OnInit } from '@angular/core';
import { HeadersService } from '../../services/headers.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-responsive-overview',
  templateUrl: './responsive-overview.component.html',
  styleUrls: ['./responsive-overview.component.css']
})
export class ResponsiveOverviewComponent implements OnInit {

  isAdmin = false;

  constructor(
    private headerService: HeadersService,
    private authenticationService: AuthenticationService
  ) {  }

  ngOnInit() {
    const roles = this.headerService.getRoles();
    if (roles.includes('Admin')) {
      this.isAdmin = true;
    }
    if (this.authenticationService.checkLogin()) {
      this.authenticationService.validateLogin().subscribe(result => { }, error => {
        this.authenticationService.logout();
        window.location.reload();
      });
    }
  }

}
