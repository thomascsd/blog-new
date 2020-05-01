import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { BlogService } from '../core/blog.service';

declare var ng: any;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
})
export class BlogComponent implements OnInit {
  title = '';
  bgImageUrl = '';
  publishedDate = '';
  post: ScullyRoute;

  constructor(private scullyService: ScullyRoutesService, private blogService: BlogService) {}

  ngOnInit() {
    this.scullyService.getCurrent().subscribe((route) => {
      this.post = route;
      this.post.date = this.blogService.getPostDateFormRoute(this.post.route);
    });
  }
}
