import { Component } from "@angular/core";
import { first } from "rxjs/operators";

import { Employee } from "../_models";
import { EmployeeService } from "../_services";

@Component({ templateUrl: "home.component.html" })
export class HomeComponent {
  employee: Employee;
  loading = false;
  employeeFromApi: Employee;

  constructor(private employeeService: EmployeeService) {
    this.employee = this.employeeService.employeeValue;
  }

  ngOnInit() {
    this.loading = true;
    this.employeeService
      .getById(this.employee.idEmployee)
      .pipe(first())
      .subscribe(emp => {
        this.loading = false;
        this.employeeFromApi = emp;
      });
  }
}
