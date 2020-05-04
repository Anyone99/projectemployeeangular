import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { HomeComponent } from './Home';

const accountModule = () => import('./Login/account.module').then(x => x.AccountModule);
