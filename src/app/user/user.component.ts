import { Component } from '@angular/core';

import { Employee } from '../_models';
import { AccountService } from '../_services';

@Component({ templateUrl: 'user.component.html' })
export class UserComponent {
    employee: Employee;

    constructor(private accountService: AccountService) {
        this.employee = this.accountService.employeeValue;
    }
}