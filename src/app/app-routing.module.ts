import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './authentication/authGuard';
const routes:Routes=[
  {path:"create",component:PostCreateComponent,canActivate:[authGuard]},
  {path:"",component:PostListComponent},
  {path:"edit/:id",component:PostCreateComponent,canActivate:[authGuard]},
  {path:"login",component:LoginComponent},
  {path:"signup",component:SignupComponent}
]




@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes),RouterModule,BrowserModule],
  exports:[RouterModule],
  providers:[authGuard]
})
export class AppRoutingModule { }
