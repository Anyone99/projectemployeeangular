import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home";
import { AuthGuard } from "./_helpers";
import { AdminComponent } from "./admin";
import { Role } from "./_models";
const accountModule = () =>
  import("./account/account.module").then(x => x.AccountModule);
const usersModule = () =>
  import("./users/users.module").then(x => x.UsersModule);

const routes: Routes = [
  { path: "", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "employee", loadChildren: usersModule, canActivate: [AuthGuard] },
  { path: "account", loadChildren: accountModule },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },

  // otherwise redirect to home
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
