import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({templateUrl : 'login.component.html'})
export class LoginComponent implements OnInit {
  loginForm : FormGroup;
  loading = false;
  submitted = false;
  returnUrl : string;

  constructor(
    private formBuilder : FormBuider,
    private route : ActivetedRoute,
    private router : Router,
  )

}