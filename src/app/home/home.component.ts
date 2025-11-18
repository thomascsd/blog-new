import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable, zip } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { BlogService } from '../core/blog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  links$: Observable<ScullyRoute[]>;
  page: number;
  itemCount = 0;

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
    const pageSize = 10;

    this.links$ = zip(this.scullyService.available$, this.route.queryParams).pipe(
      map(([routes, params]) => {
        this.page = parseInt(params.page || 1, 10);

        let items = routes.filter((route) => !!route.title).reverse();
        // .slice((this.page - 1) * pageSize, this.page * pageSize);

        items.forEach((route) => (route.date = this.blogService.getPostDateFormRoute(route.route)));
        // 使用 BlogService.isEnglishRoute 統一判斷英文路由（集中管理判斷邏輯）
        items = items.filter((route) => !this.blogService.isEnglishRoute(route.route));

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

    this.router.navigate(['/'], { queryParams: { page: pageNum }, replaceUrl: true });
  }

  next() {
    this.router.navigate(['/'], { queryParams: { page: this.page + 1 }, replaceUrl: true });
  }

  /**
   * 公開格式化標籤名稱的方法供範本使用
   */
  formatTagName(tag: string): string {
    return this.blogService.formatTagName(tag);
  }

  /**
   * 公開取得標籤的方法供範本使用
   */
  getTagsFromRoute(route: ScullyRoute): string[] {
    return this.blogService.getTagsFromRoute(route);
  }
}
