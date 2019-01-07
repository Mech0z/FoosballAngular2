import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlayerService, MatchService } from '../services/index';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.interface';
import { Match } from '../models/match';

@Component({
  selector: 'app-last-games',
  templateUrl: './last-games.component.html',
})
export class LastGamesComponent {
  errorMessage: string;
  loading: boolean;
  matches: Match[];

  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.matchService.getLatestMatches(10).subscribe(result => {
      this.matches = result;
      this.loading = false;
    }, error => {
      this.errorMessage = "Error in request: " + error.errorMessage;
      this.loading = false;
    });
  }
}
