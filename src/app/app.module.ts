import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

//sirve para crear fake back
import { fakeBackendProvider } from "./_helpers";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { JwtInterceptor, ErrorInterceptor } from "./_helpers";
import { HomeComponent } from "./home";
import { AdminComponent } from "./admin";
import { LoginComponent } from "./login";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],

  declarations: [AppComponent, HomeComponent, AdminComponent, LoginComponent],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    //privider used to create fake backend
    fakeBackendProvider
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
