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
import { startWith, map } from 'rxjs/operators';
import { HeadersService } from '../services/headers.service';
import { LeaderboardService } from '../services/leaderboard.service';

@Component({
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.scss']
})
export class AddMatchComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  players: User[] = [];
  selectedPlayers: User[] = [];
  loading = true;
  showAll = false;
  matchStarted = false;
  isLoggedIn = false;
  haveRole = false;
  errorMessage$ = new BehaviorSubject<string>('');
  message$ = new BehaviorSubject<string>('');
  matchesValid$ = new BehaviorSubject<boolean>(false);

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
    private matchService: MatchService,
    private headersService: HeadersService,
    private leaderboardService: LeaderboardService,
    private router: Router) { }

  ngOnInit() {
    if (this.headersService.getUsername().length > 0) {
      this.isLoggedIn = true;
    }
    const roles = this.headersService.getRoles();
    if (roles.includes('Player') || roles.includes('Admin')) {
      this.haveRole = true;
    }
    if (this.haveRole && this.isLoggedIn) {
      this.doMagic();
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
    const fPlayers = this.players.filter(p => this.showAll || !p.noElo);
    if (!this.showAll) {
      fPlayers.sort((a, b) => b.currentElo - a.currentElo);
    }
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

  private doMagic() {
    this.http.get<User[]>('/api/Player/GetUsers').subscribe(users => {
      this.players = users;
      this.players.sort((p1, p2) => p1.username.localeCompare(p2.username));
      this.subs.push(
        this.leaderboardService.getSeasons().subscribe(seasons => {
          const activeSeasons = seasons.filter(function (item) {
            return new Date(item.startDate).getTime() <= Date.now();
          });

          const orderedSeasons = activeSeasons.sort(function (a, b) {
            return a.startDate > b.startDate ? 1 : 0;
          });
          const currentSeason = orderedSeasons[orderedSeasons.length - 1];

          this.subs.push(
            this.http.get<Leaderboard[]>('/api/leaderboard/index').subscribe(leaderboards => {
              leaderboards.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

              let l: Leaderboard;
              leaderboards.forEach(leaderboard => {
                if (leaderboard.seasonName === currentSeason.name) {
                  l = leaderboard;
                }
              });

              this.players.forEach(p => {
                p.currentElo = l.entries.filter(e => e.userName === p.email).map(e => e.eloRating)[0];
                if (!p.currentElo) {
                  p.currentElo = 1500;
                  p.noElo = true;
                }
              });

              this.loading = false;
            })
          );
        })
      );
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
    this.subs.push(
      this.matchService.submitMatch(request)
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
          })
    );
  }

}

