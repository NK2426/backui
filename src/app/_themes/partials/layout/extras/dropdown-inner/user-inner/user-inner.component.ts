import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, Subscription } from 'rxjs';
import { AuthService, UserType } from '../../../../../../modules/auth';
import { TranslationService } from '../../../../../../modules/i18n';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html'
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  user$: Observable<UserType>;
  langs = languages;
  roles: Array<{ id: number; name: string }> = [
    { id: 0, name: 'ADMIN' },
    { id: 1, name: 'HR' },
    { id: 2, name: 'Category Head' },
    { id: 3, name: 'Purchaser' },
    { id: 4, name: 'Purchase Head' },
    { id: 5, name: 'Warehouse Operator' },
    { id: 6, name: 'Vendor' },
    { id: 7, name: 'Web Team' },
    { id: 8, name: 'Finance' },
    { id: 9, name: 'Content Writer' },
    // { id: 10, name: 'Customer Support' },
    { id: 11, name: 'Content Manager' },
    { id: 12, name: 'Picker' },
    { id: 13, name: 'Packer' }
  ];
  rolename:any
  private unsubscribe: Subscription[] = [];
  public user = JSON.parse(sessionStorage.getItem('token') || '{}');
  constructor(private auth: AuthService, private translationService: TranslationService,
    private permissionsService: NgxPermissionsService) { }

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.setLanguage(this.translationService.getSelectedLanguage());

    let role = this.roles.find(e =>e.id === this.user.role)

    this.rolename = role.name
    console.log(this.rolename);
    

  }

  logout() {
    this.auth.logout();
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.permissionsService.flushPermissions();
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg'
  },
  {
    lang: 'zh',
    name: 'Mandarin',
    flag: './assets/media/flags/china.svg'
  },
  {
    lang: 'es',
    name: 'Spanish',
    flag: './assets/media/flags/spain.svg'
  },
  {
    lang: 'ja',
    name: 'Japanese',
    flag: './assets/media/flags/japan.svg'
  },
  {
    lang: 'de',
    name: 'German',
    flag: './assets/media/flags/germany.svg'
  },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg'
  }
];
