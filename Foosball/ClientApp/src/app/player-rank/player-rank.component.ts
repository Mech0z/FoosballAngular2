import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from '../services/player.service';
import { GraphModel } from '../models/GraphModel';

@Component({
  selector: 'app-player-rank',
  templateUrl: './player-rank.component.html',
  styleUrls: ['./player-rank.component.scss']
})
export class PlayerRankComponent implements OnInit, OnDestroy {

    multi: any[];
    view: any[] = [1500, 700];
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
      private playerService: PlayerService) {
      }

    // ngOnInit(): void {
    //    this.playerService.getPlayerRank('madsskipper@gmail.com', 'Season Of Glory (15)').subscribe(result => {
    //       const data: GraphModel[] = [{name: 'Mads', series: []}];

    //       result.rankPlots.forEach(plot => {
    //         data[0].series.push({name: plot.date.toString(), value: plot.eloRating});
    //       });

    //       let array_name;
    //       array_name = [data];

    //       this.datasource = data;
    //    }, error => {
    //      console.error(error);
    //    });
    // }

    ngOnInit(): void {

      this.playerService.getPlayersRanks('The Hip Season (16)').subscribe(result => {
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
