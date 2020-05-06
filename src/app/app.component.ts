import { Component } from '@angular/core';

import { AccountService } from './_services';
import { Employee } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    employee: Employee;

    constructor(private accountService: AccountService) {
        this.accountService.employee.subscribe(x => this.employee = x);
    }

    logout() {
        this.accountService.logout();
    }
}