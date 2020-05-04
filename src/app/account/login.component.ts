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
    private formBuilder : FormBuilder,
    private route : ActivatedRoute,
    private router : Router,

  ) {
    
  }
  //inicializar los datos.
  ngOnInit(){
    this.loginForm = this.formBuilder.group({
      email :['',Validators.required],
      password : ['',Validators.required]
    });
    //obtener la devolución del url o por defecto /
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f(){ return this.loginForm.controls;}

  
}