import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
const routes:Routes=[
  {path:"create",component:PostCreateComponent},
  {path:"",component:PostListComponent},
  {path:"edit/:id",component:PostCreateComponent}
]




@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes),RouterModule,BrowserModule],
  exports:[RouterModule]
})
export class AppRoutingModule { }
