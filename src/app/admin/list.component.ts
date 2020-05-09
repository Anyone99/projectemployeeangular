import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { first, debounceTime, switchMap } from "rxjs/operators";
import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { Employee } from "../_models";
import { AccountService } from "../_services";
import { Observable } from "rxjs";

@Component({ templateUrl: "list.component.html" })
export class ListComponent implements OnInit {
  searchText;
  employees = null;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.searchText;
    this.accountService
      .getAll()
      .pipe(debounceTime(200))
      .subscribe(employees => (this.employees = employees));
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
