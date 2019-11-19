import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetStatusResponse } from '../models/GetStatusResponse';
import { ReplaySubject } from 'rxjs';
import { FoosballHubService } from './foosballhub.service';
import { take } from 'rxjs/operators';

@Injectable()
export class ActivityService {
  activityText = new ReplaySubject<string>();
  activitySeconds = new ReplaySubject<number>();
  activity = new ReplaySubject<boolean>();
  lastActivityChange = new ReplaySubject<Date>();

  constructor(private http: HttpClient, private foosballHubService: FoosballHubService) {
    this.getActivity();
    this.foosballHubService.connect();
    this.foosballHubService.connection.on('ActivityUpdated', (activity: boolean, duration: number, lastActivity: Date) => {
      this.activity.next(activity);
      this.activitySeconds.next(duration);
      this.lastActivityChange.next(lastActivity);
      this.setActivityText();
    });
  }

  getActivity() {
    return this.http.get<GetStatusResponse>('/api/IoT/GetStatus').pipe(take(1)).subscribe(response => {
      this.activity.next(response.activity);
      this.activitySeconds.next(response.duration);
      this.setActivityText();
    });
  }

  refresh() {
    this.getActivity();
  }

  setActivityText() {
    this.activity.pipe(take(1)).subscribe((active) => {
      const text = active ? 'Busy!' : 'Free!';
      this.activityText.next(text);
    });
  }
}
