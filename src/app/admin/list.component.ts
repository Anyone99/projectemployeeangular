import { Component, OnInit } from "@angular/core";
import { first, debounceTime, switchMap } from "rxjs/operators";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Employee, EmployeeResponse } from "../_models";
import { AccountService } from "../_services";
import { Observable } from "rxjs";

@Component({ templateUrl: "list.component.html" })
export class ListComponent implements OnInit {
  employees = null;
  filteredEmployee: Observable<EmployeeResponse>;
  employeeFrom: FormGroup;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.accountService
      .getAll()
      .pipe(first())
      .subscribe(employees => (this.employees = employees));

    this.employeeFrom = this.formBuilder.group({
      employeeInput: null
    });

    this.filteredEmployee = this.employeeFrom
      .get("employeeInput")
      .valueChanges.pipe(
        debounceTime(200),
        switchMap(value =>
          this.accountService.findByEmployee({nombre: value}, 1)
        )
      );
  }

  displyFn(employee: Employee){
    if (employee){
      return employee.nombre;
    }
  }

  deleteUser(id: string) {
    const employee = this.employees.find(x => x.id === id);
    employee.isDeleting = true;
    this.accountService
      .delete(id)
      .pipe(first())
      .subscribe(() => {
        this.employees = this.employees.filter(x => x.id !== id);
      });
  }
}
