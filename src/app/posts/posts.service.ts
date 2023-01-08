import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import {map} from"rxjs/operators";

import { Post } from "./post.model";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{postcount:number,posts:Post[]}>();
  private postCount:number=0;

  constructor(private http: HttpClient,private router:Router) {}
  deletePost(id?:string){
    this.http.delete<{message:string}>("http://localhost:3000/api/posts/"+id)
    .subscribe(res=>{
      this.posts=this.posts.filter(p=>p.id!==id);
      this.postCount-=1;
      this.postsUpdated.next({postcount:this.postCount,posts:[...this.posts]});
    }
    );
  }
  getPosts(pageSize:number,currentPage:number) {
    const reqQuery=`?pagesize=${pageSize}&currentpage=${currentPage}`
    this.http
    .get<{ message: string; posts: any,postcount:string }>(
      "http://localhost:3000/api/posts"+reqQuery
    )
    .pipe(map((postdata)=>{
      return{postcount:postdata.postcount,posts:
      postdata.posts.map((post: { _id: string; title: string; content: string;imagepath:string })=>
        {
        return{
          id:post._id,
          title:post.title,
          content:post.content,
          imagepath:post.imagepath
        }
      }
      )
    }
    }))
    .subscribe(result => {
      this.posts =result.posts;
      this.postCount=+result.postcount
      this.postsUpdated.next({postcount:this.postCount,posts:[...this.posts]});
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  getPostById(id:string){
     return this.http.get<{message:string,post:Post}>("http://localhost:3000/api/posts/"+id);  }
  addPost(title: string, content: string,image:File) {
    const postdata=new FormData();
    postdata.append("title",title);
    postdata.append("content",content);
    postdata.append("image",image,title);
    this.http
      .post<{ message: string,post:Post }>("http://localhost:3000/api/posts", postdata)
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }
  updatepost(post:Post){
    let newPost;

    if(typeof(post.imagepath)=='string'){
      newPost=post;
    }
    else{

      newPost=new FormData();
      newPost.append("id",post.id!);
      newPost.append("title",post.title!);
      newPost.append("content",post.content!);
      newPost.append("image",post.imagepath!,post.title);
    }
    this.http
    .put<{message:string,imagepath:string}>("http://localhost:3000/api/posts/"+post.id, newPost)
    .subscribe(result=>{
      this.router.navigate(["/"]);

    });

  }
}
