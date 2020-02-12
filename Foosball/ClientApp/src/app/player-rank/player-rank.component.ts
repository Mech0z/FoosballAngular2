import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from '../services/player.service';
import { GraphModel } from '../models/GraphModel';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-player-rank',
  templateUrl: './player-rank.component.html',
  styleUrls: ['./player-rank.component.scss']
})
export class PlayerRankComponent implements OnInit, OnDestroy {

    multi: any[];
    view: any[] = [1000, 600];
    datasource: GraphModel[];
    // options
    legend = true;
    showLabels = true;
    animations = true;
    xAxis = true;
    yAxis = true;
    showYAxisLabel = true;
    showXAxisLabel = true;
    xAxisLabel = 'Date';
    yAxisLabel = 'Rating';
    timeline = true;
    autoScale = true;

    colorScheme = {
      domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };

    constructor(
      private playerService: PlayerService,
      private router: Router,
      private route: ActivatedRoute) {
      }

    ngOnInit(): void {
      // localhost:4200/player-rank/madsskipper@gmail.com/The%20Hip%20Season%20%2816%29
      const email = this.route.snapshot.paramMap.get('email');
      const season = this.route.snapshot.paramMap.get('season');

      if(email === null) {
        this.initAllPlayers(season);
      } else {
        this.initSinglePlayer(email, season);
      }
    }

    initSinglePlayer(email: string, season: string) {
      this.playerService.getPlayerRank(email, season).subscribe(result => {
        const data: GraphModel[] = [{name: email, series: []}];

        result.rankPlots.forEach(plot => {
          data[0].series.push({name: plot.date, value: plot.eloRating});
        });

        let array_name;
        array_name = [data];

        this.datasource = data;
     }, error => {
       console.error(error);
     });
    }

    initAllPlayers(season: string) {
      this.playerService.getPlayersRanks(season).subscribe(result => {
              const data: GraphModel[] = [];
              result.forEach(element => {
                const player: GraphModel = {name: element.email, series: []};
                element.rankPlots.forEach(plot => {
                  player.series.push({name: plot.date, value: plot.eloRating});
               });
               data.push(player);
              });

               this.datasource = data;
            }, error => {
              console.error(error);
            });
    }

    onSelect(data): void {
      // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data): void {
      // console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data): void {
      // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }

    ngOnDestroy(): void {
      // this.subs.forEach(s => s.unsubscribe());
    }
}
