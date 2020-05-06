import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { AccountService } from "../_services";
import { Employee } from "../_models";

@Component({ templateUrl: "admin.component.html" })
export class AdminComponent implements OnInit {
  loading = false;
  employees: Employee[] = [];

  constructor(private employeeService: AccountService) {}
  //inicializar los datos.
  ngOnInit() {
    this.loading = true;
    this.employeeService
      .getAll()
      .pipe(first())
      .subscribe(employees => {
        this.loading = false;
        this.employees = employees;
      });
  }
}
