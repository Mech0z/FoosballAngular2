import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlayerService } from '../services/index';
import { GetPlayerSeasonHistoryResponse } from '../models/GetPlayerSeasonHistoryResponse';

@Component({
  selector: 'player-details',
  templateUrl: 'player-details.component.html'
})

export class PlayerDetailsComponent implements OnInit {
  public playerSeasonHistory: GetPlayerSeasonHistoryResponse;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    this.getPlayerHistory();
  }
  getPlayerHistory() {
    var email = this.route.snapshot.paramMap.get('email');
    this.playerService.getPlayerHistory(email)
      .subscribe(
        data => {
          this.playerSeasonHistory = data;
        },
        error => {
          console.error(error);
        });
  }
}

