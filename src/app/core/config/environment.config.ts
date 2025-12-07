import { InjectionToken } from '@angular/core';

export interface AppEnvironment {
  production: boolean;
  apiUrl: string;
}

//Unique DI token for environment configuration
export const ENVIRONMENT = new InjectionToken<AppEnvironment>('app.environment');
