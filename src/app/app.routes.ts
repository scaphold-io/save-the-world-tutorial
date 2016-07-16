import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { CharitySuggestionComponent } from './charity';

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'request', component: CharitySuggestionComponent },
  { path: 'tutorial', component: AboutComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
