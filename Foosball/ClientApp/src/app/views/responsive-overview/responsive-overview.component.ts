import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, fromEvent, Subscription, Subject, ReplaySubject } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { HeadersService } from '../../services/headers.service';
import { ThemeService } from '../../shared/theme.service';

@Component({
  selector: 'app-responsive-overview',
  templateUrl: './responsive-overview.component.html',
  styleUrls: ['./responsive-overview.component.scss']
})
export class ResponsiveOverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  private subs = new Subscription();
  darkTheme$: Observable<boolean>;
  fabVisible = new Subject<boolean>();
  fabVisible$ = this.fabVisible.asObservable();
  refreshVisible = new ReplaySubject<boolean>();
  refreshVisible$ = this.refreshVisible.asObservable();
  _refreshVisible: boolean;
  isAdmin: boolean;
  startOffset: number;
  startTime: number;
  endTime: number;
  startY: number;
  lastY: number;
  endY: number;

  constructor(
    private themeService: ThemeService,
    private headerService: HeadersService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.darkTheme$ = this.themeService.darkTheme$;
    const roles = this.headerService.getRoles();
    if (roles.includes('Admin')) {
      this.isAdmin = true;
    }
    if (this.authenticationService.checkLogin()) {
      this.authenticationService.validateLogin().subscribe(() => { }, () => {
        this.authenticationService.logout();
        window.location.reload();
      });
    }
  }

  ngAfterViewInit() {
    this.setupScrollSubscribtion();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private setupScrollSubscribtion() {
    const touchStart = fromEvent(this.scrollContainer.nativeElement, 'touchstart');
    const touchMove = fromEvent(this.scrollContainer.nativeElement, 'touchmove');
    const touchEnd = fromEvent(this.scrollContainer.nativeElement, 'touchend');
    const scroll = fromEvent(this.scrollContainer.nativeElement, 'scroll');

    this.subs.add(touchStart.subscribe((e: any) => {
      this.startOffset = this.scrollContainer.nativeElement.scrollTop;
      this.startY = e.changedTouches[0].clientY;
      this.startTime = new Date().getTime();
    }));

    this.subs.add(touchEnd.subscribe((e: any) => {
      this.endY = e.changedTouches[0].clientY;
      this.endTime = new Date().getTime();
      const elapsedMs = this.endTime - this.startTime;
      // Prevent Mads and Martin from ruining my beautifull feature
      if (this._refreshVisible && elapsedMs > 500) {
        location.reload();
      }
      this.refreshVisible.next(false);
    }));

    this.subs.add(touchMove.subscribe((e: any) => {
      if (this.startOffset !== 0) { return; }
      const currentY = e.changedTouches[0].clientY;
      this._refreshVisible = this.lastY < currentY;
      this.refreshVisible.next(this._refreshVisible);
      this.lastY = currentY;
    }));

    this.subs.add(scroll.subscribe(() => {
      const scrollElement = this.scrollContainer.nativeElement;
      const offset = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.offsetHeight;
      this.fabVisible.next(offset < 40);
    }));
  }
}
