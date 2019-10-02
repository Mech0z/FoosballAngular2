import { Component } from '@angular/core';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
})
export class ActivityComponent {
    activityText: string;
    activityMinutes: number;

    constructor(
        private activityService: ActivityService
    ) {
        this.refreshActivity();
     }

    refreshActivity() {
        this.activityService.getActivity().subscribe(response => {
            if (response.activity) {
                this.activityText = 'Room is busy!';
            } else {
                this.activityText = 'Room is free!';
            }
            this.activityMinutes = response.duration;
        });
    }
}
