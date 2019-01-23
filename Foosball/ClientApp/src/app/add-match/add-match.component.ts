import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Leaderboard } from '../models/leaderboard.interface';
import { User } from '../models/user.interface';
import { SaveMatchesRequest, MatchResult } from '../models/SaveMatchesRequest';
import { MatchService } from '../services/match.service';
import { Match } from '../models/Match';
import { HeadersService } from '../services';

@Component({
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.css']
})
export class AddMatchComponent {
  players: User[] = [];
  loading = true;
  showAll = false;
  matchStarted = false;
  isLoggedIn = false;
  haveRole = false;
  errorMessage = '';
  message: string;

  match1team1score: number;
  match1team2score: number;

  match2team1score: number;
  match2team2score: number;


  constructor(private http: HttpClient, private matchService: MatchService, private headersService: HeadersService) {
    if (headersService.getUsername().length > 0) {
      this.isLoggedIn = true;
    }
    const roles = headersService.getRoles();
    if (roles.includes('Player') || roles.includes('Admin')) {
      this.haveRole = true;
    }
    if (this.haveRole && this.isLoggedIn) {
      this.doMagic();
    }

  }

  showAllToggle() {
    this.showAll = !this.showAll;

  }
  togglePlayer(player: User) {
    if (!player.isSelected && this.selectedPlayers.length >= 4) {
      return;
    }

    player.isSelected = !player.isSelected;
  }

  get filteredPlayers(): User[] {
    const fPlayers = this.players.filter(p => this.showAll || !p.noElo);
    if (!this.showAll) {
      fPlayers.sort((a, b) => b.currentElo - a.currentElo);
    }
    return fPlayers;
  }

  get selectedPlayers(): User[] {
    let sPlayers = !this.players ? [] : this.players.filter(p => p.isSelected);
    sPlayers.sort((a, b) => b.currentElo - a.currentElo);
    if (sPlayers.length === 4) {
      sPlayers = [sPlayers[0], sPlayers[3], sPlayers[1], sPlayers[2]];
    }
    return sPlayers;
  }

  private doMagic() {
    this.http.get<User[]>('/api/Player/GetUsers').subscribe(users => {
      this.players = users;
      this.players.sort((p1, p2) => p1.username.localeCompare(p2.username));

      this.http.get<Leaderboard[]>('/api/leaderboard/index').subscribe(leaderboards => {
        leaderboards.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        const l = leaderboards[0];

        this.players.forEach(p => {
          p.currentElo = l.entries.filter(e => e.userName === p.email).map(e => e.eloRating)[0];
          if (!p.currentElo) {
            p.currentElo = 1500;
            p.noElo = true;
          }
        });

        this.loading = false;

      });
    });
  }

  get isMatchesValid(): boolean {
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
    this.matchService.submitMatch(request)
      .subscribe(
        () => {
          console.log('success');
          this.selectedPlayers.forEach(p => p.isSelected = false);
          this.matchStarted = false;
        },
        error => {
          console.log('fail');
          console.log(error);
          this.message = error.message;
        });
  }

}

