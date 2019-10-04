import { Component } from '@angular/core';
import { fromEvent, merge, of, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-online',
  template: '<p *ngIf="isOnlineMessage"><em>{{isOnlineMessage}}</em></p>'
})

export class OnlineComponent {
  online$: Observable<boolean>;
  isOnlineMessage: string;

  constructor() {
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );
    this.networkStatus();
  }

  public networkStatus() {
    this.online$.subscribe(value => {
      if (value) {
         this.isOnlineMessage = "";
      } else {
        this.isOnlineMessage = "You are currently offline! Data might not be up-to-date";
      }
    });
  }
}
