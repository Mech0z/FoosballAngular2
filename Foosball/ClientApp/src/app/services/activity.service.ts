import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetStatusResponse } from '../models/GetStatusResponse';
import { ReplaySubject } from 'rxjs';
import { FoosballHubService } from './foosballhub.service';
import { take } from 'rxjs/operators';

@Injectable()
export class ActivityService {
  activityText$ = new ReplaySubject<string>();
  activitySecond$ = new ReplaySubject<number>();
  activity$ = new ReplaySubject<boolean>();
  lastActivity$ = new ReplaySubject<Date>();

  constructor(private http: HttpClient, private foosballHubService: FoosballHubService) {
    this.getActivity();
    this.foosballHubService.connect();
    this.foosballHubService.connection.on('ActivityUpdated', (activity: boolean, duration: number, lastActivity: Date) => {
      this.activity$.next(activity);
      this.activitySecond$.next(duration);
      this.lastActivity$.next(lastActivity);
      this.activityText$.next(activity ? 'Busy!' : 'Free!');
    });
  }

  getActivity() {
    return this.http.get<GetStatusResponse>('/api/IoT/GetStatus').pipe(take(1)).subscribe(response => {
      this.activity$.next(response.activity);
      this.activitySecond$.next(response.duration);
      this.activityText$.next(response.activity ? 'Busy!' : 'Free!');
    });
  }
}
