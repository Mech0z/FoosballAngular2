import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaveMatchesRequest, Match, MatchResult } from '../models/SaveMatchesRequest';
import { MatchService } from '../services/index';

@Component({
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.css']
})
export class AddMatchComponent {
  public players: Player[];
  public addedPlayers: Player[];

  public team1Player1: Player;
  public team1Player2: Player;
  public team2Player1: Player;
  public team2Player2: Player;

  constructor(
    private matchService: MatchService) {
    this.players = new Array(
      new Player(1, "Martin", 10),
      new Player(2, "Peter", 9),
      new Player(3, "No Name 1", 8),
      new Player(4, "No Name 2", 6),
      new Player(5, "No Name 3", 7),
      new Player(6, "No Name 4", 6),
      new Player(7, "No Name 5", 5),
      new Player(8, "No Name 6", 4),
      new Player(9, "No Name 7", 3),
      new Player(10, "No Name 8", 2));
    this.addedPlayers = new Array();
  }

  addPlayer(player: Player) {
    var foundIndex = -1;

    this.addedPlayers.forEach((value, index) => {
      if (value.id == player.id) {
        foundIndex = index;
      }
    });
    
    if (foundIndex != -1) {
      this.addedPlayers.splice(foundIndex, 1);
    } else {
      if (this.addedPlayers.length == 4) {
        return;
      }
      this.addedPlayers.push(player);
    }

    var sortedArray: Player[] = this.addedPlayers.sort((n1, n2) => n1.elo - n2.elo);
    this.team1Player1 = sortedArray[0];
    this.team1Player2 = sortedArray[3];
    this.team2Player1 = sortedArray[1];
    this.team2Player2 = sortedArray[2];
  }

  submitMatch() {
    var request = new SaveMatchesRequest();
    request.email = "madsskipper@gmail.com";

    var match1 = new Match();
    match1.playerList = new Array("madsskipper@gmail.com", "pfr@seges.dk", "mahj@seges.dk", "vik@seges.dk");
    match1.submittedBy = "madsskipper@gmail.com";
    match1.matchResult = new MatchResult(8, 2);
    //match1.timeStampUtc = Date.now();
    request.matches = new Array(match1);

    this.matchService.submitMatch(request)
      .subscribe(
        () => {
          console.debug("success");
        },
        () => {
          console.debug("fail");
        });;
  }
}

class Player {
  constructor(id: number, name: string, elo: number) {
    this.id = id;
    this.name = name;
    this.elo = elo;
  }

  id: number;
  name: string;
  elo: number;
}
