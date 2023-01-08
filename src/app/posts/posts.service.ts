import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import {map} from"rxjs/operators";

import { Post } from "./post.model";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient,private router:Router) {}
  deletePost(id?:string){
    this.http.delete<{message:string}>("http://localhost:3000/api/posts/"+id)
    .subscribe(res=>{
      this.posts=this.posts.filter(p=>p.id!==id);
      this.postsUpdated.next([...this.posts]);}
    );
  }
  getPosts() {
    this.http
    .get<{ message: string; posts: any }>(
      "http://localhost:3000/api/posts"
    )
    .pipe(map((postdata)=>{
      return postdata.posts.map((post: { _id: string; title: string; content: string;imagepath:string })=>
        {
        return{
          id:post._id,
          title:post.title,
          content:post.content,
          imagepath:post.imagepath
        }
      }
      )

    }))
    .subscribe(returnedposts => {
      this.posts = returnedposts;
      this.postsUpdated.next([...this.posts]);
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
        const post={
          id:responseData.post.id,
          title:title,
          content:content,
          imagepath:responseData.post.imagepath

        }
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
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
      const updatedPost=this.posts;
      const index=updatedPost.findIndex(p=>p.id==post.id);
      updatedPost[index]=post;
      updatedPost[index].imagepath=result.imagepath as string;
      this.posts=updatedPost;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);

    });

  }
}
