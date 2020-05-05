import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { EmployeeService } from "../_services";
import { Employee } from "../_models";

@Component({ templateUrl: "admin.component.html" })
export class AdminComponent implements OnInit {
  loading = false;
  admin: Employee[] = [];

  constructor(private employeeService: EmployeeService) {}
  //inicializar los datos.
  ngOnInit() {
    this.loading = true;
    this.employeeService
      .getAll()
      .pipe(first())
      .subscribe(admin => {
        this.loading = false;
        this.admin = admin;
      });
  }
}
