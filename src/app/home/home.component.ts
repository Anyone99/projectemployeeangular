import { Component } from '@angular/core';

import { Employee } from '../_models';
import { AccountService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: Employee;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.employeeValue;
    }
}