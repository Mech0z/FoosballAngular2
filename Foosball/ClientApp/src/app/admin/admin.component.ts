import { Component } from '@angular/core';
import { AdministrationService } from '../services/index';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  message: string;
  loading: boolean;

  constructor(
    private administrationSerivce: AdministrationService  ) { }

  ngOnInit() {
  }

  startNewSeason() {
    this.loading = true;
    this.administrationSerivce.startNewSeason().subscribe(() => {
      this.loading = false;

    }, error => {
      this.loading = false;
      this.message = error.message;
    });
  }
}
