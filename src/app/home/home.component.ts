import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  links$: Observable<ScullyRoute[]>;
  page: number;

  constructor(
    private scullyService: ScullyRoutesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    const pageSize = 10;

    this.links$ = zip(this.scullyService.available$, this.route.params).pipe(
      map(([routes, params]) => {
        this.page = parseInt(params.page, 10);
        return routes
          .filter((route) => !!route.title)
          .reverse()
          .slice((this.page - 1) * pageSize, this.page * pageSize);
      })
    );
  }

  previous() {
    let pageNum = this.page - 1;

    if (pageNum === 0) {
      pageNum = 1;
    }

    this.router.navigate(['home', pageNum]);
  }

  next() {
    this.router.navigate(['home', this.page + 1]);
  }

  getImageUrl(imageUrl: string) {
    return imageUrl || 'assets/images/bg1920x872.jpg';
  }
}
