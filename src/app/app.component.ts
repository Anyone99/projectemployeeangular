import { Component } from "@angular/core";

import { AccountService } from "./_services";
import { Employee, Role } from "./_models";

@Component({ selector: "app", templateUrl: "app.component.html" })
export class AppComponent {
  employee: Employee;

  constructor(private accountService: AccountService) {
    this.accountService.employee.subscribe(x => (this.employee = x));
  }

  logout() {
    this.accountService.logout();
  }

  get isAdmin() {
    return this.employee.role === Role.Admin;
  }
}
