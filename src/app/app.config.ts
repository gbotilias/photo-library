import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { routes } from './app.routes';
import { ENVIRONMENT } from './core/config/environment.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    // Register environment config for DI
    // Angular auto-switches between dev/prod based on build mode
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
  ],
};
