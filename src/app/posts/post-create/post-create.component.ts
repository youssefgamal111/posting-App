import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";

import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post:Post;
   id?:string;
   loaded:boolean=true;
  constructor(public postsService: PostsService,public route:ActivatedRoute) { this.post = {
    id: "",
    title:"",
    content:""
  };}
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('id'))
       {
        this.id=paramMap.get('id')!;
        this.loaded=false;
        this.postsService.getPostById(this.id)
        .subscribe(b=>
          {this.loaded=true;
            this.post=b.post;
          }
        )
      }
      else
      {this.id="";}

    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loaded=false;
    if(this.id!==""){
     this.postsService.updatepost({
      id:this.id,
      title:form.value.title,
      content:form.value.content
     });
    }
    else{
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
    }
  }
}
