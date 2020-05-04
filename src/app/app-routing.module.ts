import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./Home";

const accountModule = () =>
  import("./account/account.module").then(x => x.AccountModule);

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "", loadChildren: accountModule },

  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
