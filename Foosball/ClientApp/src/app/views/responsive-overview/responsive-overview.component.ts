import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { HeadersService } from '../../services/headers.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ThemeService } from '../../shared/theme.service';
import { Observable, merge, fromEvent, Subscription, Subject } from 'rxjs';

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
  refreshVisible = new Subject<boolean>();
  refreshVisible$ = this.refreshVisible.asObservable();
  isAdmin = false;
  startOffset: number;
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
      this.authenticationService.validateLogin().subscribe(result => { }, error => {
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
    const mouseDown = fromEvent(this.scrollContainer.nativeElement, 'touchstart');
    const mouseUp = fromEvent(this.scrollContainer.nativeElement, 'touchend');
    const mouseMove = fromEvent(this.scrollContainer.nativeElement, 'touchmove');
    const scrollEnd = fromEvent(this.scrollContainer.nativeElement, 'scroll');

    this.subs.add(mouseDown.subscribe((e: any) => {
      this.startOffset = this.scrollContainer.nativeElement.scrollTop;
      this.startY = e.changedTouches[0].clientY;
    }));
    this.subs.add(mouseUp.subscribe((e: any) => {
      this.endY = e.changedTouches[0].clientY;
      const scrollOverTop = this.endY - this.startY - this.startOffset;
      if (scrollOverTop > 200) {
        location.reload();
      } else {
        this.refreshVisible.next(false);
      }
    }));
    this.subs.add(mouseMove.subscribe((e: any) => {
      const currentY = e.changedTouches[0].clientY;
      this.refreshVisible.next((currentY - this.startY - this.startOffset > 0) && this.lastY < currentY);
      this.lastY = currentY;
    }));
    this.subs.add(scrollEnd.subscribe((e: any) => {
      const scrollElement = this.scrollContainer.nativeElement;
      const offset = scrollElement.offsetHeight - scrollElement.scrollTop + scrollElement.offsetHeight;
      this.fabVisible.next(offset < 100);
    }));

  }
}
