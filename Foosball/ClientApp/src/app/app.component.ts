import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { FoosballHubService } from './services/foosballhub.service';
import { ThemeService } from './shared/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Foosball';
  constructor(private swUpdate: SwUpdate, private foosballHubService: FoosballHubService, private theme: ThemeService) {
  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version available. Load new version?')) {
          window.location.reload();
        }
      });
    }
  }
}
