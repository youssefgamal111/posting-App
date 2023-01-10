import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../authentication/auth.service';
import { User } from '../authentication/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loaded:boolean=false;
  user:User | undefined;
  constructor(private auth:AuthService){}
  ngOnInit(): void {
   this.loaded=true;
  }
  onLogin(form:NgForm): void{
    if(form.invalid)return;
    this.user={email:form.value.email,password:form.value.password};
    this.loaded=false;
    this.auth.authenticateUser(this.user);
  }

}
