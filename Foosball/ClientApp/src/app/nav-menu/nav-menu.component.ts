import { Component } from '@angular/core';
import { HeadersService, AdministrationService, AuthenticationService } from '../services';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
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

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
