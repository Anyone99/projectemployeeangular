import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs";

import { Alert, AlertType } from "../_models";
import { AlertService } from "../_services";

@Component({ selector: "alert", templateUrl: "alert.component.html" })
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = "default-alert";
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit() {
    // pone una nueva mensaje con alert
    this.alertSubscription = this.alertService
      .onAlert(this.id)
      .subscribe(alert => {
        // alertas cuando se recibe una alerta vacía
        if (!alert.message) {
          // filtrar las alertas sin el indicador 'keepAfterRouteChange'

          this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

          // elimina 'keepAfterRouteChange' cuando resetea
          this.alerts.forEach(x => delete x.keepAfterRouteChange);
          return;
        }

        // añadir mensaje alerta dentro del Array
        this.alerts.push(alert);

        // se cierra el mensaje alerta automáticamente
        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(alert), 1000);
        }
      });

    // borrar la alserta cuando cuambia de ubicacion de navegacion
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  //Elimianr alerta
  removeAlert(alert: Alert) {
    // comprobar si ya se ha eliminado para evitar errores al cerrar automáticamente
    if (!this.alerts.includes(alert)) return;

    if (this.fade) {
      // desvanecer la alerta
      this.alerts.find(x => x === alert).fade = true;

      //eliminar la alerta después de desvanecimiento
      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x !== alert);
      }, 250);
    } else {
      //elimina alerta
      this.alerts = this.alerts.filter(x => x !== alert);
    }
  }

  //css
  cssClass(alert: Alert) {
    if (!alert) return;

    const classes = ["alert", "alert-dismissable", "mt-4", "container"];

    const alertTypeClass = {
      [AlertType.Success]: "alert alert-success",
      [AlertType.Error]: "alert alert-danger",
      [AlertType.Info]: "alert alert-info",
      [AlertType.Warning]: "alert alert-warning"
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push("fade");
    }

    return classes.join(" ");
  }
}
