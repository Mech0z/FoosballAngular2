import { Component, OnInit } from '@angular/core';
import { HeadersService } from '../../services/headers.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ThemeService } from '../../shared/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-responsive-overview',
  templateUrl: './responsive-overview.component.html',
  styleUrls: ['./responsive-overview.component.scss']
})
export class ResponsiveOverviewComponent implements OnInit {
  darkTheme$: Observable<boolean>;
  isAdmin = false;

  constructor(
    private themeService: ThemeService,
    private headerService: HeadersService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.darkTheme$ = this.themeService.darkTheme$;
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
