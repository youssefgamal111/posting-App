import { HttpClient,  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   token:string="";
   private isAuthenticated=new Subject<boolean>();
  constructor(private http:HttpClient) { }
  createUser(user:User){
   this.http.post<{messsage:string,user:User}>("http://localhost:3000/api/user/signup",user).subscribe(
    res=>
    console.log(res)
   )

  }
  authenticateUser(user:User){
    this.http.post<{message:string,token:string}>("http://localhost:3000/api/user/login",user).subscribe(
      res=>{
      const token=res.token;
      this.token=token;
      this.isAuthenticated.next(true);
    }
     )
  }
  isAuthenticatedObs(){
   return this.isAuthenticated.asObservable();

  }
     getToken():string{
      return this.token;
     }

}
