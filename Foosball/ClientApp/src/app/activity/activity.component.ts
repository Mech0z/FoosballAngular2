import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivityService } from '../services/activity.service';
import { FoosballHubService } from '../services/foosballhub.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
    styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {

    constructor(public activityService: ActivityService) { }

    refreshActivity() {
        this.activityService.getActivity();
    }
}
