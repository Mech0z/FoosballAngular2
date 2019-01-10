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
  public email: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    this.getPlayerHistory();
  }
  getPlayerHistory() {
    this.email = this.route.snapshot.paramMap.get('email');
    this.playerService.getPlayerHistory(this.email)
      .subscribe(
        data => {
          this.playerSeasonHistory = data;
          this.playerSeasonHistory.playerLeaderBoardEntries.reverse();
        },
        error => {
          console.error(error);
        });
  }
}

