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
   expirein:string="";
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
    this.http.post<{message:string,token:string,expiresin:string}>("http://localhost:3000/api/user/login",user).subscribe(
      res=>{
      const token=res.token;
      this.token=token;
      const now=new Date();
      const expiredate=new Date(now.getTime() +(+res.expiresin *1000));
      this.createTimer(+res.expiresin *1000);
      this.isAuthenticated.next(true);
      this.saveAuthData(this.token,expiredate);
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

  saveAuthData(token:string,expirein:Date){
    localStorage.setItem("token",token);
    localStorage.setItem("expirein",expirein.toISOString());

  }

  clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expirein");

  }

  getAuthData(){
    const token=localStorage.getItem("token");
    const expirein=localStorage.getItem("expirein");
    if(token && expirein){
      return{token:token,expirein:new Date(expirein)}
    }
    return;
  }
  autoAuthUser(){
   const authInfo= this.getAuthData();
   if(authInfo==null)return;
   const now=new Date();
   if(authInfo!.expirein > now){
    this.token=authInfo!.token;
    this.isAuthenticated.next(true);
    this.createTimer(now.getTime()-authInfo!.expirein.getTime());
  }
  }

  createTimer(expiredate:number){
    this.tokentimer=setTimeout(() => {
      this.logOut();
    }, expiredate);
  }

}
