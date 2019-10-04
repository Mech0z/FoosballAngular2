import { Component } from '@angular/core';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
})
export class ActivityComponent {
    activityText: string;
    activitySeconds: number;
    activity: boolean;

    constructor(
        private activityService: ActivityService
    ) {
        this.refreshActivity();
     }

    refreshActivity() {
        this.activityService.getActivity().subscribe(response => {
            this.activity = response.activity;
            if (response.activity) {
                this.activityText = 'Room is busy!';
            } else {
                this.activityText = 'Room is free!';
            }
            this.activitySeconds = response.duration;
        });
    }
}
