import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
@Injectable()
export class authGuard implements CanActivate{
  constructor(private authService:AuthService,private router:Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
     const auth=this.authService.isAuthenticatedValue();
    if(!auth){
      this.router.navigate(["/"]);

    }
    return auth;
  }

}
function ingectable() {
  throw new Error("Function not implemented.");
}

