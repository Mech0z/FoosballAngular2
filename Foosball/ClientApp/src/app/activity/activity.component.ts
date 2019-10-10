import { Component } from '@angular/core';
import { ActivityService } from '../services/activity.service';
import { FoosballHubService } from '../services/foosballhub.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
})
export class ActivityComponent {
    activityText: string;
    activitySeconds: number;
    activity: boolean;
    lastActivityChange: Date;

    constructor(
        private activityService: ActivityService,
        private foosballHubService: FoosballHubService
    ) {
        this.refreshActivity();

        this.foosballHubService.connect();
        foosballHubService.connection.on('ActivityUpdated', (activity: boolean, duration: number, lastActivity: Date) => {
            this.activity = activity;
            this.activitySeconds = duration;
            this.lastActivityChange = lastActivity;
            this.setActivityText();
        });
     }

    refreshActivity() {
        this.activityService.getActivity().subscribe(response => {
            this.activity = response.activity;
            this.setActivityText();
        });
    }

    setActivityText() {
        if (this.activity) {
            this.activityText = 'Room is busy!';
        } else {
            this.activityText = 'Room is free!';
        }

        this.activitySeconds = this.activitySeconds;
    }
}
