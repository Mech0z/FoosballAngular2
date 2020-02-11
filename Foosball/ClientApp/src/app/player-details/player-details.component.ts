import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { GetPlayerSeasonHistoryResponse } from '../models/GetPlayerSeasonHistoryResponse';
import { User } from '../models/user.interface';
import { Match } from '../models/Match';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map, finalize } from 'rxjs/operators';
import { PartnerPercentResult } from '../models/PartnerPercentResult';
import { PlayerService } from '../services/player.service';
import { MatchService } from '../services/match.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-player-details',
  templateUrl: 'player-details.component.html',
  styleUrls: ['./player-details.component.scss']
})

export class PlayerDetailsComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  playerSeasonHistory: GetPlayerSeasonHistoryResponse;
  users: User[];
  selectedUser: User = {} as User;
  matches: Match[];
  selectUserControl = new FormControl();
  filteredUsers: Observable<User[]>;
  partnerResult: PartnerPercentResult[];
  loading: boolean;

  public get email(): string {
    return this.selectedUser ? this.selectedUser.email : '';
  }
  public get userName(): string {
    return this.selectedUser ? this.selectedUser.username : '';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  displayFn(user?: User): string | undefined {
    return user ? user.username : undefined;
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(u => u.username.toLowerCase().includes(filterValue));
  }

  getPlayerHistory() {
    this.loading = true;
    if (!this.email) {
      this.selectedUser.email = this.route.snapshot.paramMap.get('email');
    }

    this.subs.push(
      this.matchService.getPlayerLatestMatches(this.email)
        .subscribe(data => {
          this.matches = data.slice(0, 10);
        })
    );

    this.subs.push(
      this.playerService.getPlayerHistory(this.email)
        .pipe(finalize(() => this.loading = false))
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
          })
    );
    this.subs.push(
      this.playerService.getPartnerResult(this.email).subscribe(result => {
        this.partnerResult = result;
      }, error => {
        console.error(error);
      })
    );
  }

  onChange(event: MatAutocompleteSelectedEvent) {
    this.playerSeasonHistory = null;
    this.selectedUser = event.option.value;
    this.updateName();
    this.updateUrl();
    this.getPlayerHistory();
  }

  getUsers() {
    this.subs.push(
      this.playerService.getUsers().subscribe(result => {
        this.users = result;
        this.users.sort((a, b) => {
          if (a.username < b.username) { return -1; }
          if (a.username > b.username) { return 1; }
          return 0;
        });
        this.updateName();
      }, error => console.error(error))
    );
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

  updateName() {
    if (!this.selectedUser && this.users) {
      this.users.forEach(user => {
        if (user.email === this.email) {
          this.selectedUser = user;
        }
      });
    }
  }

  private updateUrl() {
    this.router.navigate(['player-details', this.selectedUser.email]);
  }
}
