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
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scullyService: ScullyRoutesService
  ) {}

  ngOnInit() {
    this.scullyService.getCurrent().subscribe((route) => {
      this.title = route.title;
      this.bgImageUrl = route.bgImageUrl;
    });
  }
}
