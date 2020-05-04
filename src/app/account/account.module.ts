import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {AccountRoutingModule} from './account-routing.module';
import {LoginComponent} from './login.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountRoutingModule
  ],

  declarations: [
    LoginComponent,
  ]
})

export class AccountModule { }
