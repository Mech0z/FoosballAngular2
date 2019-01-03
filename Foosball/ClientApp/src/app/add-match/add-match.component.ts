import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Leaderboard } from '../models/leaderboard.interface';
import { forEach } from '@angular/router/src/utils/collection';
import { User } from '../models/user.interface';

@Component({
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.css']
})
export class AddMatchComponent {
  players: User[] = [];
  loading = true;
  showAll = false;
  constructor(private http: HttpClient) {
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



    }
      , error => console.error(error));


  }
}
