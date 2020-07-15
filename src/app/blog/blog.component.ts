import { Component, OnInit, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { BlogService } from '../core/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  preserveWhitespaces: true,
})
export class BlogComponent implements OnInit {
  post: ScullyRoute;

  constructor(
    private scullyService: ScullyRoutesService,
    private blogService: BlogService,
    private titleService: Title,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document
  ) {}

  ngOnInit() {
    this.scullyService.getCurrent().subscribe((route) => {
      this.post = route;
      this.post.date = this.blogService.getPostDateFormRoute(this.post.route);
      this.titleService.setTitle(route.title);
    });

    const s = this.renderer2.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://utteranc.es/client.js';
    s.setAttribute('repo', 'thomascsd/thomascsd.github.io');
    s.setAttribute('issue-term', 'pathname');
    s.setAttribute('theme', 'github-light');
    s.setAttribute('crossorigin', 'anonymous');
    s.text = ``;
    this.renderer2.appendChild(this.document.querySelector('#comments'), s);
  }
}
