import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EmployeeService } from "./_services";
import { Employee, Role } from "./_models";

@Component({
  selector: "app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  employee: Employee;

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.employeeService.employee.subscribe(x => (this.employee = x));
  }

  get isAdmin() {
    return this.employee && this.employee.role === Role.Admin;
  }

  logout() {
    this.employeeService.logout();
    this.router.navigate(["/login"]);
  }
}
