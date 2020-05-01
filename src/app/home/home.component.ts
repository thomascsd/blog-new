import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlogService } from '../core/blog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  links$: Observable<ScullyRoute[]>;
  page: number;
  itemCount: number;

  constructor(
    private scullyService: ScullyRoutesService,
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    const pageSize = 10;

    this.links$ = zip(this.scullyService.available$, this.route.params).pipe(
      map(([routes, params]) => {
        this.page = parseInt(params.page, 10);

        const items = routes
          .filter((route) => !!route.title)
          .reverse()
          .slice((this.page - 1) * pageSize, this.page * pageSize);

        items.forEach((route) => (route.date = this.blogService.getPostDateFormRoute(route.route)));

        this.itemCount = items.length;

        return items;
      })
    );
  }

  previous() {
    let pageNum = this.page - 1;

    if (pageNum === 0) {
      pageNum = 1;
    }

    this.router.navigate(['home', pageNum]);
    this.loadData();
  }

  next() {
    this.router.navigate(['home', this.page + 1]);
    this.loadData();
  }
}
