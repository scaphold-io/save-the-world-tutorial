import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { CharityFormComponent } from './charity';

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'submit', component: CharityFormComponent },
  { path: 'about', component: AboutComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
