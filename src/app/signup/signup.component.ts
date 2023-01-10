import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  loaded:boolean=true;
  user: User | undefined;
  constructor(private auth:AuthService){}
  onSignUp(form:NgForm): void{
    if(form.invalid)return;
     this.user={email:form.value.email,password:form.value.password};
     this.auth.createUser(this.user);
  }

}
