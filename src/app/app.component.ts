import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslationService } from './modules/i18n';

// language list
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { delay } from 'rxjs';
import { AuthService } from './modules/auth';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { roleMapping } from './pages/role-mapping';
import { LoaderService } from './_helpers/loader.service';
import { ThemeModeService } from './_themes/partials/layout/theme-mode-switcher/theme-mode.service';

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
  status!: boolean;
  auth_user!: any;
  invokeOnce = false;
  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService, private permissionsService: NgxPermissionsService,
    private loaderService: LoaderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {

    // register translations
    this.translationService.loadTranslations(enLang, chLang, esLang, jpLang, deLang, frLang);
  }

  ngAfterViewInit() {
    this.loaderService.httpProgress()
      .pipe(delay(0))
      .subscribe((status: boolean) => {
        if (this.status !== status) {
          this.status = status;
          this.cdr.detectChanges();
        }
      });
  }

  ngOnInit() {
    this.modeService.init();


    this.authService.currentUser$.subscribe((auth_user) => {
      if (auth_user && Object.keys(auth_user).length) {
        this.auth_user = auth_user;
        let permissionIDs = Object.values(roleMapping);
        let permissionValues = Object.keys(roleMapping);
        if (permissionIDs.length) {
          permissionIDs.forEach((permissionID, index) => {
            if (permissionID === auth_user.role) {
              this.permissionsService.addPermission(permissionValues[index]);
            }
          });
        }
      }
    });

    this.permissionsService.permissions$.subscribe((permissions) => {
      
    });
  }
}
