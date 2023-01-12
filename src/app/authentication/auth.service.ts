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
   userid:string="";
   private isAuthenticated=new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient,private router:Router) { }
  createUser(user:User){
   this.http
   .post<{messsage:string,user:User}>("http://localhost:3000/api/user/signup",user)
   .subscribe( res=>
    console.log(res)
   )
   this.router.navigate(["/"]);

  }
  authenticateUser(user:User){
    this.http.post<{message:string,token:string,expiresin:string,userid:string}>("http://localhost:3000/api/user/login",user).subscribe(
      res=>{
      const token=res.token;
      this.token=token;
      const now=new Date();
      const expiredate=new Date(now.getTime() +(+res.expiresin *1000));
      this.createTimer(+res.expiresin *1000);
      this.userid=res.userid;
      this.isAuthenticated.next(true);
      this.saveAuthData(this.token,expiredate,this.userid);
      this.router.navigate(["/"]);
    }
     )
  }

  logOut(){
  clearTimeout(this.tokentimer);
  this.clearAuthData();
    this.token="";
    this.userid="";
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

  saveAuthData(token:string,expirein:Date,userid:string){
    localStorage.setItem("token",token);
    localStorage.setItem("expirein",expirein.toISOString());
    localStorage.setItem("userid",userid);

  }

  clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expirein");
    localStorage.removeItem("userid");

  }

  getAuthData(){
    const token=localStorage.getItem("token");
    const expirein=localStorage.getItem("expirein");
    const userid=localStorage.getItem("userid");
    if(token && expirein&&userid){
      return{token:token,expirein:new Date(expirein),userid:userid}
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
    this.userid=authInfo!.userid;
    this.createTimer(authInfo!.expirein.getTime()-now.getTime());
  }
  }

  createTimer(expiredate:number){
    this.tokentimer=setTimeout(() => {
     this.logOut();
    }, expiredate);
  }

}
