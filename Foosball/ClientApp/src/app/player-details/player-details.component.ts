import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PlayerService } from '../services/index';

@Component({
  selector: 'player-details',
  templateUrl: 'player-details.component.html'
})

export class PlayerDetailsComponent implements OnInit {
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.playerService.getPlayerHistory("madsskipper@gmail.com")
      .subscribe(
        data => {
          var result = data;
        },
        error => {
          this.loading = false;
        });
  }
}

