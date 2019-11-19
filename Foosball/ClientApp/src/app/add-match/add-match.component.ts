import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Leaderboard } from '../models/leaderboard.interface';
import { User } from '../models/user.interface';
import { SaveMatchesRequest, MatchResult } from '../models/SaveMatchesRequest';
import { MatchService } from '../services/match.service';
import { Match } from '../models/Match';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map, finalize, take } from 'rxjs/operators';
import { HeadersService } from '../services/headers.service';
import { LeaderboardService } from '../services/leaderboard.service';
import { ThemeService } from '../shared/theme.service';

@Component({
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.scss']
})
export class AddMatchComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  darkTheme$: Observable<boolean>;
  players: User[] = [];
  selectedPlayers: User[] = [];
  loading = false;
  submitting = false;
  showAll = false;
  matchStarted = false;
  isLoggedIn = false;
  haveRole = false;
  errorMessage$ = new BehaviorSubject<string>('');
  message$ = new BehaviorSubject<string>('');
  matchesValid$ = new BehaviorSubject<boolean>(false);
  activeLeaderboard: Leaderboard;

  match1team1score: number;
  match1team2score: number;

  match2team1score: number;
  match2team2score: number;

  evenMoreFilteredPlayers: Observable<User[]>;
  filterPlayersControl = new FormControl();

  private set errorMessage(val: string) {
    this.errorMessage$.next(val);
  }

  private set message(val: string) {
    this.message$.next(val);
  }

  setValidStatus() {
    this.matchesValid$.next(this.areMatchesValid);
  }

  constructor(
    private http: HttpClient,
    private theme: ThemeService,
    private matchService: MatchService,
    private headersService: HeadersService,
    private leaderboardService: LeaderboardService,
    private router: Router) { }

  ngOnInit() {
    this.darkTheme$ = this.theme.darkTheme$;
    if (this.headersService.getUsername().length > 0) {
      this.isLoggedIn = true;
    }
    const roles = this.headersService.getRoles();
    if (roles.includes('Player') || roles.includes('Admin')) {
      this.haveRole = true;
    }
    if (this.haveRole && this.isLoggedIn) {
      this.getUsers();
    }

    this.evenMoreFilteredPlayers = this.filterPlayersControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => name ? this._filter(name) : this.filteredPlayers.slice())
      );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return filterValue.length > 0 ? this.filteredPlayers.filter(u => u.username.toLowerCase().includes(filterValue)) : this.filteredPlayers;
  }

  showAllToggle() {
    this.showAll = !this.showAll;
    // Trigger the filter observable to emit its current value when toggling
    this.filterPlayersControl.setValue(this.filterPlayersControl.value);
  }

  togglePlayer(player: User) {
    if (!player.isSelected && this.selectedPlayers.length >= 4) {
      return;
    }

    player.isSelected = !player.isSelected;
    this.setTeamsBasedOnElo();
    this.filterPlayersControl.setValue('');
  }

  get filteredPlayers(): User[] {
    const playersActiveThisSeasson = this.activeLeaderboard ? this.activeLeaderboard.entries.map(p => p.userName) : [];
    const fPlayers = this.showAll ? this.players : this.players.filter((p: User) => playersActiveThisSeasson.includes(p.email));
    fPlayers.sort((a, b) => b.currentElo - a.currentElo);
    return fPlayers;
  }

  setTeamsBasedOnElo() {
    let sPlayers = !this.players ? [] : this.players.filter(p => p.isSelected);
    sPlayers.sort((a, b) => b.currentElo - a.currentElo);
    if (sPlayers.length === 4) {
      sPlayers = [sPlayers[0], sPlayers[3], sPlayers[1], sPlayers[2]];
    }
    this.selectedPlayers = sPlayers;
  }

  private getUsers() {
    this.loading = true;
    this.http.get<User[]>('/api/Player/GetUsers').pipe(take(1), finalize(() => this.loading = false)).subscribe(users => {
      this.players = users;
      this.players.sort((p1, p2) => p1.username.localeCompare(p2.username));
      this.leaderboardService.getSeasons().pipe(take(1)).subscribe(seasons => {
        const activeSeasons = seasons.filter((item) => {
          return new Date(item.startDate).getTime() <= Date.now();
        });

        const orderedSeasons = activeSeasons.sort((a, b) => {
          const aDate = new Date(a.startDate);
          const bDate = new Date(b.startDate);
          return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
        });
        const currentSeason = orderedSeasons[orderedSeasons.length - 1];



        this.http.get<Leaderboard[]>('/api/leaderboard/index').pipe(take(1)).subscribe(leaderboards => {
          leaderboards.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

          leaderboards.forEach(leaderboard => {
            if (leaderboard.seasonName === currentSeason.name) {
              this.activeLeaderboard = leaderboard;
            }
          });

          this.players.forEach(p => {
            p.currentElo = this.activeLeaderboard.entries.filter(e => e.userName === p.email).map(e => e.eloRating)[0];
            if (!p.currentElo) {
              p.currentElo = 1500;
              p.noElo = true;
            }
          });

          this.filterPlayersControl.setValue('');
        });
      });
    });
  }

  get areMatchesValid(): boolean {
    const match1Valid = (this.match1team1score >= 0 && this.match1team2score >= 0 &&
      ((this.match1team1score === 8 && this.match1team2score >= 0 && this.match1team2score <= 6
        || this.match1team2score === 8 && this.match1team1score >= 0 && this.match1team1score <= 6)
        || (this.match1team1score > 8 && this.match1team2score === this.match1team1score - 2)
        || (this.match1team2score > 8 && this.match1team1score === this.match1team2score - 2)));

    const match2Data = this.match2team1score > 0 || this.match2team2score > 0;
    const match2Valid = (this.match2team1score >= 0 && this.match2team2score >= 0 &&
      ((this.match2team1score === 8 && this.match2team2score >= 0 && this.match2team2score <= 6
        || this.match2team2score === 8 && this.match2team1score >= 0 && this.match2team1score <= 6)
        || (this.match2team1score > 8 && this.match2team2score === this.match2team1score - 2)
        || (this.match2team2score > 8 && this.match2team1score === this.match2team2score - 2)));

    if (!match1Valid) {
      this.errorMessage = 'Match 1 has an invalid score';
    }
    if (match2Data) {
      if (match1Valid && !match2Valid) {
        this.errorMessage = 'Match 2 has an invalid score';
      }
      const allMatchesValid = match1Valid && match2Valid;
      if (allMatchesValid) {
        this.errorMessage = '';
      }
      return allMatchesValid;
    }
    if (match1Valid) {
      this.errorMessage = '';
    }
    return match1Valid;
  }

  switchPlayers(index1: number, index2: number) {
    const tmp = this.selectedPlayers[index1];
    this.selectedPlayers[index1] = this.selectedPlayers[index2];
    this.selectedPlayers[index2] = tmp;
  }

  submitMatch() {
    this.submitting = true;
    const request = {
      email: this.headersService.getUsername(),
      matches: [{
        playerList: this.selectedPlayers.map(p => p.email),
        submittedBy: this.headersService.getUsername(),
        matchResult: new MatchResult(this.match1team1score, this.match1team2score)
      }]
    } as SaveMatchesRequest;

    if (this.match2team1score >= 0 && this.match2team2score >= 0) {
      request.matches.push({
        playerList: this.selectedPlayers.map(p => p.email),
        submittedBy: this.headersService.getUsername(),
        matchResult: new MatchResult(this.match2team1score, this.match2team2score)
      } as Match);
    }
    this.matchService.submitMatch(request)
      .pipe(
        take(1),
        finalize(() => this.submitting = false))
      .subscribe(
        () => {
          console.log('success');
          this.selectedPlayers.forEach(p => p.isSelected = false);
          this.matchStarted = false;
          this.router.navigate(['leaderboard']);
        },
        error => {
          console.log('fail');
          console.log(error);
          this.message = error.message;
        });
  }

}

