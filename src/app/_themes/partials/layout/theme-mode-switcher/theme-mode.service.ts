import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeModeComponent } from '../../../kt/layout';

export type ThemeModeType = 'dark' | 'light' | 'system';
const systemMode = ThemeModeComponent.getSystemMode() as 'light' | 'dark';
const themeModeSwitchHelper = (_mode: ThemeModeType) => {
  // change background image url
  const mode = _mode !== 'system' ? _mode : systemMode;
  const imageUrl = './assets/media/patterns/header-bg' + (mode === 'light' ? '.jpg' : '-dark.png');
  document.body.style.backgroundImage = `url("${imageUrl}")`;
};

const themeModeLSKey = 'kt_theme_mode_value';
const themeMenuModeLSKey = 'kt_theme_mode_menu';

const getThemeModeFromSessionStorage = (lsKey: string): ThemeModeType => {
  if (!sessionStorage) {
    return 'light';
  }

  const data = sessionStorage.getItem(lsKey);
  if (!data) {
    return 'light';
  }

  if (data === 'light') {
    return 'light';
  }

  if (data === 'dark') {
    return 'dark';
  }

  return 'system';
};

@Injectable({
  providedIn: 'root'
})
export class ThemeModeService {
  public mode: BehaviorSubject<ThemeModeType> = new BehaviorSubject<ThemeModeType>(getThemeModeFromSessionStorage(themeModeLSKey));
  public menuMode: BehaviorSubject<ThemeModeType> = new BehaviorSubject<ThemeModeType>(getThemeModeFromSessionStorage(themeMenuModeLSKey));

  constructor() { }

  public updateMode(_mode: ThemeModeType) {
    const updatedMode = _mode === 'system' ? systemMode : _mode;
    this.mode.next(updatedMode);
    // themeModeSwitchHelper(updatedMode)
    if (sessionStorage) {
      sessionStorage.setItem(themeModeLSKey, updatedMode);
    }

    document.documentElement.setAttribute('data-bs-theme', updatedMode);
    ThemeModeComponent.init();
  }

  public updateMenuMode(_menuMode: ThemeModeType) {
    this.menuMode.next(_menuMode);
    if (sessionStorage) {
      sessionStorage.setItem(themeMenuModeLSKey, _menuMode);
    }
  }

  public init() {
    this.updateMode(this.mode.value);
    this.updateMenuMode(this.menuMode.value);
  }

  public switchMode(_mode: ThemeModeType) {
    if (sessionStorage) {
      const updatedMode = _mode === 'system' ? systemMode : _mode;
      sessionStorage.setItem(themeModeLSKey, updatedMode);
      sessionStorage.setItem(themeMenuModeLSKey, _mode);
    }
    document.location.reload();
  }
}
