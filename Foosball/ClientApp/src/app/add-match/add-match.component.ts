import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.css']
})
export class AddMatchComponent {
  players: Player[];
  loading = true;
  constructor(http: HttpClient) {

    http.get<User[]>('/api/Player/GetUsers').subscribe(result => {
     this.players = result.map(r => this.toPlayer(r));
     this.players.sort((p1, p2) => p1.name.localeCompare(p2.name));
     this.loading = false;
    }
    , error => console.error(error));
  }

  toPlayer(r: User) : Player {
    return { id: 0, name: r.username, elo: 0 } as Player;
  }

  togglePlayer(player: Player) {
    player.isSelected = !player.isSelected;
  }


  get selectedPlayers(): Player[] {
    return !this.players ? [] : this.players.filter(p => p.isSelected);
  }
}

interface Player {
  id: number;
  name: string;
  elo: number;
  isSelected: boolean;
}
