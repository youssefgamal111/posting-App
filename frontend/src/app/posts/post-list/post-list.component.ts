import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/authentication/auth.service";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  private postsSub!: Subscription;
  private authSub!: Subscription;
  isAuthenticated:boolean=false;
  loaded:boolean=true;
  pageSize:number=2;
  postCount=0;
  userid:string="";
  constructor(public postsService: PostsService,public authService:AuthService) {}

  ngOnInit() {
    this.loaded=false;
    this.userid=this.authService.userid;
    this.isAuthenticated=this.authService.isAuthenticatedValue();
    this.postsService.getPosts(this.pageSize,1);
    this.authSub=this.authService.isAuthenticatedObs().subscribe(s=>this.isAuthenticated=s);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((obj:{postcount:number,posts:Post[]}) => {
        this.loaded=true;
        this.postCount=obj.postcount;
        this.posts = obj.posts;
      });
  }
  onPagChange(page:PageEvent){
    this.loaded=false;
    const pageSize=+page.pageSize;
    const currentPage=+page.pageIndex+1;
    this.postsService.getPosts(pageSize,currentPage);
    console.log(page);
  }
  deletePost(id?:string){
 this.postsService.deletePost(id).subscribe(message=>{
  this.postsService.getPosts(this.pageSize,1);
 });
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
