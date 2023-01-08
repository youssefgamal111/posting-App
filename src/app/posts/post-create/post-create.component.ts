import { Component, OnInit } from "@angular/core";
import { FormControl, NgForm, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";

import { PostsService } from "../posts.service";
import { mimeType } from "./mime-file.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  form!: FormGroup;
  imagePreview:string="";
  post:Post;
   id?:string;
   loaded:boolean=true;
  constructor(public postsService: PostsService,public route:ActivatedRoute) { this.post = {
    id: "",
    title:"",
    content:""
  };}
  ngOnInit(): void {
    this.form=new FormGroup({
      title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
      content:new FormControl(null,{validators:[Validators.required]}),
      image:new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]})
    });
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('id'))
       {
        this.id=paramMap.get('id')!;
        this.loaded=false;
        this.postsService.getPostById(this.id)
        .subscribe(b=>
          {this.loaded=true;
            this.post=b.post;
            this.form.setValue({title:this.post.title,content:this.post.content,image:this.post.imagepath});
          }
        )
      }
      else
      {this.id="";}

    });
  }
  addImage(event:Event){
    const file=(event.target as HTMLInputElement).files;
    this.form.patchValue({image:file![0]});
    this.form.get('image')!.updateValueAndValidity();
    const reader=new FileReader();
    reader.onload=()=>{
      this.imagePreview=reader.result as string;
    }
    reader.readAsDataURL(file![0]);
  }
  onSavePost() {
    if (this.form?.invalid) {
      return;
    }
    this.loaded=false;
    if(this.id!==""){
     this.postsService.updatepost({
      id:this.id,
      title:this.form?.value.title,
      content:this.form?.value.content,
      imagepath:this.form?.value.image
     });
    }
    else{
    this.postsService.addPost(this.form?.value.title, this.form?.value.content,this.form?.value.image);
    this.form?.reset();
    }
  }
}
