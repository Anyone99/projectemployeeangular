import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './Home';

@NgModule({
  imports: [ 
    BrowserModule, 
    FormsModule],
  declarations: [
    AppComponent,
    HomeComponent
    ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
