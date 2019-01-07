import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Leaderboard } from '../models/leaderboard.interface';
import { User } from '../models/user.interface';
import { SaveMatchesRequest, MatchResult } from '../models/SaveMatchesRequest';
import { MatchService } from '../services/match.service';
import { Match } from '../models/Match';

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

  match1team1score: number;
  match1team2score: number;

  match2team1score: number;
  match2team2score: number;


  constructor(private http: HttpClient, private matchService: MatchService) {
    this.doMagic();
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
    const sPlayers = !this.players ? [] : this.players.filter(p => p.isSelected);
    sPlayers.sort((a, b) => b.currentElo - a.currentElo);
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
    return this.match1team1score >= 0 && this.match1team2score >= 0 && (this.match1team1score === 8 || this.match1team2score === 8);
  }

  submitMatch() {
    const request = {
      email: 'madsskipper@gmail.com',
      matches: [{
        playerList: this.selectedPlayers.map(p => p.email),
        submittedBy: 'madsskipper@gmail.com',
        matchResult: new MatchResult(this.match1team1score, this.match1team2score)
      }]
    } as SaveMatchesRequest;

    if (this.match2team1score >= 0 && this.match2team2score >= 0 && (this.match2team1score === 8 || this.match2team2score === 8)) {
      request.matches.push({
        playerList: this.selectedPlayers.map(p => p.email),
        submittedBy: 'madsskipper@gmail.com',
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
        () => {
          console.log('fail');
        });
  }

}

