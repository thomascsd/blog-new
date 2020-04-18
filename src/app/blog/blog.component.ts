import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, ROUTES } from '@angular/router';
import { ScullyRoutesService } from '@scullyio/ng-lib';

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
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scullyService: ScullyRoutesService
  ) {}

  ngOnInit() {
    this.scullyService.getCurrent().subscribe((route) => {
      const dateRex = /(\d{4}-\d{2}-\d{2})/g;
      this.title = route.title;
      this.bgImageUrl = route.bgImageUrl || 'assets/images/bg1920x872.jpg';
      this.publishedDate = dateRex.exec(route.route)[0];
    });
  }
}
