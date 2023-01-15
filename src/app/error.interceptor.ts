import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {  Observable, throwError } from "rxjs";
import {  catchError } from "rxjs/operators";
import { ErrordialogComponent } from "./errordialog/errordialog.component";
@Injectable()
export class errorinterceptor implements HttpInterceptor{
  constructor(public dialog: MatDialog){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  return next.handle(req).pipe(catchError(
    (error:HttpErrorResponse)=>{
         alert(error.error.message);
         this.dialog.open(ErrordialogComponent);
        return throwError(() => error);
  }
  )
  );

  }

 }


