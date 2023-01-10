import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../authentication/auth.service";

@Injectable()
export class authinterceptor implements HttpInterceptor{
  constructor(private authservice:AuthService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token=this.authservice.getToken();
    const authRequest=req.clone(
      {headers:req.headers.set("Authorization","Bearer "+token)}
    );
    return next.handle(authRequest);

  }

}
