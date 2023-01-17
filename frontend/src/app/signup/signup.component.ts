import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../authentication/user.model';
import { AuthService } from '../authentication/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  loaded:boolean=true;
  user: User | undefined;
  authSub!:Subscription;
  constructor(private authSrvice:AuthService){}
  ngOnDestroy(): void {
  this.authSub.unsubscribe();  }
  ngOnInit(): void {
  this.authSub=this.authSrvice.isAuthenticatedObs().subscribe(s=>
    this.loaded=true);
  }
  onSignUp(form:NgForm): void{
    if(form.invalid)return;
     this.user={email:form.value.email,password:form.value.password};
     this.loaded=false;
     this.authSrvice.createUser(this.user);
  }

}
