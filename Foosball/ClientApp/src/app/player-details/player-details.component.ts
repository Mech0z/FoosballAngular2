import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService, MatchService } from '../services/index';
import { GetPlayerSeasonHistoryResponse } from '../models/GetPlayerSeasonHistoryResponse';
import { User } from '../models/user.interface';
import { Match } from '../models/Match';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-player-details',
  templateUrl: 'player-details.component.html'
})

export class PlayerDetailsComponent implements OnInit {
  playerSeasonHistory: GetPlayerSeasonHistoryResponse;
  email: string;
  username: string;
  users: User[];
  selectedUser: User;
  matches: Match[];
  selectUserControl = new FormControl();
  filteredUsers: Observable<User[]>;

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private matchService: MatchService
    ) { }

  ngOnInit() {
    this.getUsers();
    this.getPlayerHistory();

    // Setup filter observable for autocomplete control
    this.filteredUsers = this.selectUserControl.valueChanges
    .pipe(
      startWith<string | User>(''),
      map(value => typeof value === 'string' ? value : value.username),
      map(name => name ? this._filter(name) : this.users.slice())
    );
  }

  displayFn(user?: User): string | undefined {
    return user ? user.username : undefined;
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(u => u.username.toLowerCase().includes(filterValue));
  }

  getPlayerHistory() {
    if (!this.email) {
      this.email = this.route.snapshot.paramMap.get('email');
    }

    this.matchService.getPlayerLatestMatches(this.email)
      .subscribe(data => {
        this.matches = data.slice(0, 10);
      });

    this.playerService.getPlayerHistory(this.email)
      .subscribe(
        data => {
          this.playerSeasonHistory = data;
          this.playerSeasonHistory.playerLeaderBoardEntries.reverse();
          this.playerSeasonHistory.eggStats.matchesGivenEgg.sort((b, c) =>
            new Date(b.timeStampUtc).getTime() - new Date(c.timeStampUtc).getTime());
          this.playerSeasonHistory.eggStats.matchesReceivedEgg.sort((b, c) =>
            new Date(b.timeStampUtc).getTime() - new Date(c.timeStampUtc).getTime());
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

  onChange(event: MatAutocompleteSelectedEvent) {
    this.selectedUser = event.option.value;
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
    let result = '';
    this.users.forEach(player => {
      if (player.email === email) {
        result = player.username;
      }
    });

    return result;
  }

  setName() {
    this.users.forEach(user => {
      if (user.email === this.email) {
        this.username = user.username;
      }
    });
  }
}
