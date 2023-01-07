import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import {map} from"rxjs/operators";

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}
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
      return postdata.posts.map((post: { _id: string; title: string; content: string; })=>
        {
        return{
          id:post._id,
          title:post.title,
          content:post.content
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
  addPost(title: string, content: string) {
    const post: Post = { id: "jh", title: title, content: content };
    this.http
      .post<{ message: string,id:string }>("http://localhost:3000/api/posts", post)
      .subscribe(responseData => {
        post.id=responseData.id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
  updatepost(post:Post){
    console.log(post);
    this.http
    .put<{message:string}>("http://localhost:3000/api/posts/"+post.id, post)
    .subscribe(result=>{
      const updatedPost=this.posts;
      const index=updatedPost.findIndex(p=>p.id==post.id);
      updatedPost[index]=post;
      this.posts=updatedPost;
      this.postsUpdated.next([...this.posts]);
    });

  }
}
