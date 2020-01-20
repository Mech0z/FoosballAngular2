import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeadersService } from '../services/headers.service';
import { AdministrationService } from '../services/administration.service';
import { LeaderboardService } from '../services/leaderboard.service';
import { PlayerService } from '../services/player.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-player-rank',
  templateUrl: './player-rank.component.html',
  styleUrls: ['./player-rank.component.scss']
})
export class PlayerRankComponent implements OnInit, OnDestroy {

    multi: any[];
    view: any[] = [700, 300];
    bla =  [
      {
        'name': 'Germany',
        'series': [
          {
            'name': '1990',
            'value': 62000000
          },
          {
            'name': '2010',
            'value': 73000000
          },
          {
            'name': '2011',
            'value': 89400000
          }
        ]
      },
      {
        'name': 'USA',
        'series': [
          {
            'name': '1990',
            'value': 250000000
          },
          {
            'name': '2010',
            'value': 309000000
          },
          {
            'name': '2011',
            'value': 311000000
          }
        ]
      },
      {
        'name': 'France',
        'series': [
          {
            'name': '1990',
            'value': 58000000
          },
          {
            'name': '2010',
            'value': 50000020
          },
          {
            'name': '2011',
            'value': 58000000
          }
        ]
      },
      {
        'name': 'UK',
        'series': [
          {
            'name': '1990',
            'value': 57000000
          },
          {
            'name': '2010',
            'value': 62000000
          }
        ]
      }
    ];

    // options
    legend = true;
    showLabels = true;
    animations = true;
    xAxis = true;
    yAxis = true;
    showYAxisLabel = true;
    showXAxisLabel = true;
    xAxisLabel = 'Year';
    yAxisLabel = 'Population';
    timeline = true;

    colorScheme = {
      domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };

    constructor(
      private playerService: PlayerService) {
        const test = this.bla;
         Object.assign(this, { test });
      }

    ngOnInit(): void {
       this.playerService.getPlayerRank('madsskipper@gmail.com', 'Season Of Glory (15)').subscribe(result => {
        console.error(result);
       }, error => {
         console.error(error);
       });
    }

    onSelect(data): void {
      console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data): void {
      console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data): void {
      console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }

    ngOnDestroy(): void {
      // this.subs.forEach(s => s.unsubscribe());
    }
}
