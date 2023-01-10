import { HttpClient,  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   token:string="";
   expirein:number=0;
   tokentimer:any;
   private isAuthenticated=new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient,private router:Router) { }
  createUser(user:User){
   this.http.post<{messsage:string,user:User}>("http://localhost:3000/api/user/signup",user).subscribe(
    res=>
    console.log(res)
   )

  }
  authenticateUser(user:User){
    this.http.post<{message:string,token:string,expirein:string}>("http://localhost:3000/api/user/login",user).subscribe(
      res=>{
      const token=res.token;
      this.token=token;
      this.expirein=+res.expirein;
      this.tokentimer=  setTimeout(() => {
          this.logOut();
          alert("session ended");
        }, this.expirein*1000);
      this.isAuthenticated.next(true);
      this.router.navigate(["/"]);
    }
     )
  }
  logOut(){
  clearTimeout(this.tokentimer);
    this.token="";
    this.isAuthenticated.next(false);
  }
  isAuthenticatedObs(){
   return this.isAuthenticated.asObservable();

  }
  isAuthenticatedValue(){
    return this.isAuthenticated.getValue();
  }
     getToken():string{
      return this.token;
     }

}
