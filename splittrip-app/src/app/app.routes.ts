import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Trips } from './trips/trips';
import { Planning } from './planning/planning';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'my-trips', component: Trips },
  { path: 'plan', component: Planning },
  { path: '**', redirectTo: '' }
];
