import { Component } from '@angular/core';
import { AdministrationService } from '../services/administration.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  message: string;
  loading: boolean;

  constructor(
    private administrationSerivce: AdministrationService  ) { }

  startNewSeason() {
    this.loading = true;
    this.administrationSerivce.startNewSeason().subscribe(() => {
      this.loading = false;

    }, error => {
      this.loading = false;
      this.message = error.message;
    });
  }

  resetLeaderboard() {
    this.loading = true;
    this.administrationSerivce.recalculate().subscribe(() => {
      this.loading = false;

    }, error => {
      this.loading = false;
      this.message = error.message;
    });
  }
}
