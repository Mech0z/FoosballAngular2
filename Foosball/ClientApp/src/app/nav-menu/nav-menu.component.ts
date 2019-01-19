import { Component } from '@angular/core';
import { HeadersService, AdministrationService } from '../services';

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
    private administrationService: AdministrationService
  ) {  }

  ngOnInit() {
    const roles = this.headerService.getRoles();
    if (roles.includes('Admin')) {
      this.isAdmin = true;
    }
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
