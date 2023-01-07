import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

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
  loaded:boolean=true;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.loaded=false;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.loaded=true;
        this.posts = posts;
      });
  }
  deletePost(id?:string){
 this.postsService.deletePost(id);
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
