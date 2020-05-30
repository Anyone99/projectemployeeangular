import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Employee } from "../_models";
import { AccountService, AlertService } from "../_services";

@Component({ templateUrl: "user.component.html" })
export class UserComponent {

  employee: Employee;
  employeeFrom: Employee;
  loading = false;
  selectDiaVacaciones: number;
  vacacionQueda : number;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.employee = this.accountService.employeeValue;

    this.accountService
      .getById(this.employee.id)
      .pipe(first())
      .subscribe(x => {
        this.loading = false;
        this.employeeFrom = x;
      });
    
    this.vacacionQueda = this.employeeFrom.diaVacaciones * 1 - this.employeeFrom.vacacionPedido * 1;
   
    console.log("vacaciones queda " + this.vacacionQueda);
  }

  counter(i: number) {
    return new Array(i);
  }

  pedirVacaciones() {
    const dia = this.selectDiaVacaciones * 1 + 1 * 1;
    const diaQueda = this.employeeFrom.diaVacaciones - dia;
    //sumará vacacion de pedido + dia;
    this.employeeFrom.vacacionPedido = dia * 1 + this.employeeFrom.vacacionPedido * 1;

    console.log(dia + " ");
    console.log(this.employeeFrom);

    this.accountService
      .update(this.employeeFrom.id, this.employeeFrom)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Has pedido correctamente", {
            keepAfterRouteChange: true
          });
          this.router.navigate(["..", { relativeTo: this.router }]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
