import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, ReplaySubject } from 'rxjs';

const THEME_KEY = 'onTheDarkSideIAm';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _darkTheme$ = new ReplaySubject<boolean>();
  public darkTheme$ = this._darkTheme$.asObservable();

  constructor() {
    const isDark = localStorage.getItem(THEME_KEY) === 'true' ? true : false;
    this._darkTheme$.next(isDark);
  }

  init() {
  }

  joinThe(darkSide: boolean): void {
    this._darkTheme$.next(darkSide);
    localStorage.setItem(THEME_KEY, darkSide ? 'true' : 'false');
  }
}
