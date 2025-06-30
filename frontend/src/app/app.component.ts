import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { I18nService, LanguageSelectorComponent } from '@app/i18n';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { filter, merge } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppUpdateService, Logger } from '@core/services';
import { SocketIoService } from '@core/socket-io';

@UntilDestroy()
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-boilerplate';

  constructor(
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly translateService: TranslateService,
    private readonly i18nService: I18nService,
    private readonly socketService: SocketIoService,
    private readonly updateService: AppUpdateService,
  ) {}

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    // Initialize i18nService with default language and supported languages
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    const onNavigationEnd = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));

    merge(this.translateService.onLangChange, onNavigationEnd).pipe(untilDestroyed(this)).subscribe((event) => {
        const titles = this.getTitle(this.router.routerState, this.router.routerState.root);

        if (titles.length === 0) {
          this.titleService.setTitle(this.translateService.instant('Home'));
        } else {
          const translatedTitles = titles.map((titlePart) => this.translateService.instant(titlePart));
          const allTitlesSame = translatedTitles.every((title, _, arr) => title === arr[0]);
          this.titleService.setTitle(allTitlesSame ? translatedTitles[0] : translatedTitles.join(' | '));
        }

        if (event['lang']) {
          // Uncomment the following line to force a reload of the page when the language changes if needed for translations from backend
          // window.location.reload();
        }
      });

    // Connect to Socket
    this.socketService.connect();

    // update service
    this.updateService.subscribeForUpdates();
  }

  getTitle(state: any, parent: any): any[] {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  ngOnDestroy() {
    this.i18nService.destroy();
  }
}
