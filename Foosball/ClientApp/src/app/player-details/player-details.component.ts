import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlayerService } from '../services/index';
import { GetPlayerSeasonHistoryResponse } from '../models/GetPlayerSeasonHistoryResponse';
import { User } from '../models/user.interface';

@Component({
  selector: 'player-details',
  templateUrl: 'player-details.component.html'
})

export class PlayerDetailsComponent implements OnInit {
  public playerSeasonHistory: GetPlayerSeasonHistoryResponse;
  public email: string;
  public username: string;
  public users: User[];
  public selectedUser: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    this.getUsers();
    this.getPlayerHistory();
  }
  getPlayerHistory() {
    if (!this.email) {
      this.email = this.route.snapshot.paramMap.get('email');
    }

    this.playerService.getPlayerHistory(this.email)
      .subscribe(
        data => {
          this.playerSeasonHistory = data;
          this.playerSeasonHistory.playerLeaderBoardEntries.reverse();
          this.playerSeasonHistory.eggStats.matchesGivenEgg.sort((b, c) => new Date(b.timeStampUtc).getTime() - new Date(c.timeStampUtc).getTime());
          this.playerSeasonHistory.eggStats.matchesReceivedEgg.sort((b, c) => new Date(b.timeStampUtc).getTime() - new Date(c.timeStampUtc).getTime());
          this.playerSeasonHistory.eggStats.matchesGivenEgg.reverse();
          this.playerSeasonHistory.eggStats.matchesReceivedEgg.reverse();
          this.users.forEach(user => {
            if (user.email === this.email) {
              this.selectedUser = user;
            }
          });
        },
        error => {
          console.error(error);
        });
  }

  onChange() {
    this.playerSeasonHistory = null;
    this.email = this.selectedUser.email;
    this.selectedUser = this.selectedUser;
    this.setName();
    this.getPlayerHistory();
  }

  getUsers() {
    this.playerService.getUsers().subscribe(result => {
      this.users = result;
      this.users.sort((a, b) => {
        if (a.username < b.username) { return -1; }
        if (a.username > b.username) { return 1; }
        return 0;
      });
      this.setName();
    }, error => console.error(error));
  }

  public getName(email: string) {
    var result = "";
    this.users.forEach(player => {
      if (player.email === email) {
        result = player.username;
      };
    });

    return result;
  };

  setName() {
    this.users.forEach(user => {
      if (user.email === this.email) {
        this.username = user.username;
      }
    });
  }
}
