import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/auth.service';
import { User } from '../authentication/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  loaded:boolean=false;
  user:User | undefined;
  authSub!:Subscription;
  constructor(private authservice:AuthService){}
  ngOnDestroy(): void {
  this.authSub.unsubscribe();  }
  ngOnInit(): void {
   this.loaded=true;
   this.authSub=this.authservice.isAuthenticatedObs().subscribe(s=>this.loaded=true);
  }
  onLogin(form:NgForm): void{
    if(form.invalid)return;
    this.user={email:form.value.email,password:form.value.password};
    this.loaded=false;
    this.authservice.authenticateUser(this.user);
  }

}
