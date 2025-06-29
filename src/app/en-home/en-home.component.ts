import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable, zip } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { BlogService } from '../core/blog.service';

@Component({
  selector: 'app-en-home',
  templateUrl: './en-home.component.html',
  styleUrls: ['./en-home.component.scss'],
})
export class EnHomeComponent implements OnInit {
  links$: Observable<ScullyRoute[]>;

  constructor(
    private scullyService: ScullyRoutesService,
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.loadData();
    });
  }

  ngOnInit(): void {
    // this.loadData();
  }

  private loadData() {
    this.links$ = zip(this.scullyService.available$, this.route.queryParams).pipe(
      map(([routes, params]) => {
        let items = routes.filter((route) => !!route.title).reverse();

        items.forEach((route) => (route.date = this.blogService.getPostDateFormRoute(route.route)));
        items = items.filter((route) => route.route.indexOf('/en/') !== -1);

        return items;
      })
    );
  }
}
