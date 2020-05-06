import { Component } from '@angular/core';

import { Employee } from '../_models';
import { AccountService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    employee: Employee;

    constructor(private accountService: AccountService) {
        this.employee = this.accountService.employeeValue;
    }
}