import { Component, OnDestroy, OnInit } from "@angular/core";
import { throwToolbarMixedModesError } from "@angular/material/toolbar";

import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls:['./header.component.css'],
})
export class HeaderComponent implements OnInit,OnDestroy {
  authenticated:boolean=false;
 authSubscribtion=new Subscription();
  constructor(private authservice:AuthService){}

  ngOnInit(): void {
    this.authSubscribtion=this.authservice.isAuthenticatedObs().subscribe(
      res=>this.authenticated=res);
  }
  logout(){this.authservice.logOut();}
  ngOnDestroy(): void {
  this.authSubscribtion.unsubscribe();

  }
}
