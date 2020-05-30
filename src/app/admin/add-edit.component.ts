import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { AccountService, AlertService } from "../_services";

@Component({ templateUrl: "add-edit.component.html" })
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  fechaContrato;
  diaVacaciones;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params["id"];
    this.isAddMode = !this.id;

    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];

    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    this.form = this.formBuilder.group({
      nombre: ["", Validators.required],
      apellido: ["", Validators.required],
      dni: ["", Validators.required],
      password: ["", passwordValidators],
      fechaContrato: ["", Validators.required],
      diaVacaciones: ["", Validators.required]
    });

    if (!this.isAddMode) {
      this.accountService
        .getById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.f.nombre.setValue(x.nombre);
          this.f.apellido.setValue(x.apellido);
          this.f.dni.setValue(x.dni);
          this.f.fechaContrato.setValue(x.fechaContrato);
          this.f.diaVacaciones.setValue(
            this.calcularDiaVacionesContrato(this.f.fechaContrato.value)
          );
        });
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  calcularDiaVaciones() {
    const now = new Date(Date.now());
    if (this.fechaContrato) {
      const contrato = new Date(this.fechaContrato);
      //si la fecha de contrato es mayor que la fecha de ahora.
      if (contrato > now) {
        this.diaVacaciones = 0;
      } else {
        const mesTrabajo = 2.5;
        const timeDiff = Math.abs(now.getTime() - contrato.getTime());
        // days
        const diffDays = timeDiff / 86400000;

        const diffYear = diffDays / 365;

        const diffMonth = diffYear * 12;

        this.diaVacaciones = diffMonth * mesTrabajo;

        this.diaVacaciones = Math.floor(this.diaVacaciones);
      }
    }
  }

  /*validarNie(value: string) {
    const validChars = "TRWAGMYFPDXBNJZSQVHLCKET";
    const nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
    const nieRexp = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
    const str = value.toString().toUpperCase();

    if (!nifRexp.test(str) && !nieRexp.test(str)) return false;

    const nie = str
      .replace(/^[X]/, "0")
      .replace(/^[Y]/, "1")
      .replace(/^[Z]/, "2");

    const letter = str.substr(-1);
    const charIndex = parseInt(nie.substr(0, 8)) % 23;

    if (validChars.charAt(charIndex) === letter) return true;

    return false;
  }*/

  calcularDiaVacionesContrato(fecha: Date) {
    if (fecha) {
      const contrato = new Date(fecha);
      const now = new Date(Date.now());

      if (contrato > now) {
        this.diaVacaciones = 0;
      } else {
        const mesTrabajo = 2.5;
        const timeDiff = Math.abs(now.getTime() - contrato.getTime());
        // days
        const diffDays = timeDiff / 86400000;

        const diffYear = diffDays / 365;

        const diffMonth = diffYear * 12;

        this.diaVacaciones = diffMonth * mesTrabajo;

        this.diaVacaciones = Math.floor(this.diaVacaciones);

        console.log(diffDays + " " + this.diaVacaciones);
      }
      
      return this.diaVacaciones;
    }
  }

  private createUser() {
    this.accountService
      .register(this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success("User added successfully", {
            keepAfterRouteChange: true
          });
          this.router.navigate([".", { relativeTo: this.route }]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
    console.log("Registrar usuario ");
    console.log(this.form.value);
  }

  private updateUser() {
    this.accountService
      .update(this.id, this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Update successful", {
            keepAfterRouteChange: true
          });
          this.router.navigate(["..", { relativeTo: this.route }]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
