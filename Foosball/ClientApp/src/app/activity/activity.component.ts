import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivityService } from '../services/activity.service';
import { FoosballHubService } from '../services/foosballhub.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
    styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    activityText: string;
    activitySeconds: number;
    activity: boolean;
    lastActivityChange: Date;

    constructor(
        private activityService: ActivityService,
        private foosballHubService: FoosballHubService) { }

    public ngOnInit() {
        this.refreshActivity();

        this.foosballHubService.connect();
        this.foosballHubService.connection.on('ActivityUpdated', (activity: boolean, duration: number, lastActivity: Date) => {
            this.activity = activity;
            this.activitySeconds = duration;
            this.lastActivityChange = lastActivity;
            this.setActivityText();
        });
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    refreshActivity() {
        this.subs.push(
            this.activityService.getActivity().subscribe(response => {
                this.activity = response.activity;
                this.setActivityText();
            })
        );
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
