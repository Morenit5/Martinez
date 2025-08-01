import { ApplicationConfig, enableProdMode, importProvidersFrom,provideZoneChangeDetection, } from '@angular/core';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withPreloading, withRouterConfig,} from '@angular/router';
import { routes } from './app.routes';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { ShellModule } from './shell/shell.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, } from '@angular/common/http';
import { ApiPrefixInterceptor, ErrorHandlerInterceptor, } from '@core/interceptors';
import { RouteReusableStrategy } from '@core/helpers';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from './icons/icons.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

if (environment.production) {
  enableProdMode();
}

export const appConfig: ApplicationConfig = {
  providers: [
    // provideZoneChangeDetection is required for Angular's zone.js
    provideZoneChangeDetection({ eventCoalescing: true }),

    // import providers from other modules (e.g. TranslateModule, ShellModule, socketModule), which follow the older pattern to import modules

    importProvidersFrom(
      TranslateModule.forRoot(),
      ShellModule,
      NgbModule,
      IconsModule,
      NgbNavModule,
    ),

    // provideRouter is required for Angular's router with additional configuration
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
        paramsInheritanceStrategy: 'always',
      }),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withPreloading(PreloadAllModules),
    ),

    // provideHotToastConfig is required for HotToastModule by ngneat
    provideHotToastConfig({
      reverseOrder: true,
      dismissible: true,
      autoClose: true,
    }),

    // provideHttpClient is required for Angular's HttpClient with additional configuration, which includes interceptors from DI (dependency injection) , means to use class based interceptors
    provideHttpClient(withInterceptorsFromDi()),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy,
    },
  ],
};
