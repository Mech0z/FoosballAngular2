import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
})
export class ChangeEmailComponent {
  newEmail1: string;
  newEmail2: string;
  message: string;
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService
  ) { }

  changeEmail() {
    if (this.newEmail1 !== this.newEmail2) {
      this.message = 'Emails are not equal';
      return;
    }

    this.loading = true;

    this.playerService.changeEmail(this.newEmail1).subscribe(result => {
      this.loading = false;
      this.message = 'Emaail changed to ' + this.newEmail1;
    }, error => {
      this.message = 'Error in request: ' + error.errorMessage;
      this.loading = false;
    });
  }
}
