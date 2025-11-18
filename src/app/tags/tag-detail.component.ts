import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BlogService } from '../core/blog.service';

@Component({
  selector: 'app-tag-detail',
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.scss'],
})
export class TagDetailComponent implements OnInit {
  tag: string;
  articles$: Observable<ScullyRoute[]>;
  isEnglish = false;
  displayName: string;

  constructor(
    private route: ActivatedRoute,
    private scullyService: ScullyRoutesService,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.articles$ = (this.route.params as any).pipe(
      switchMap((params: any) => {
        this.tag = params.tag;
        // 判斷是否為英文 tag 路由
        this.isEnglish = this.blogService.isEnglishRoute(this.route.snapshot.url.join('/'));
        this.displayName = this.blogService.formatTagName(this.tag);

        return (this.scullyService.available$ as any).pipe(
          map((routes: ScullyRoute[]) => {
            const filteredRoutes = routes.filter((route) => !!route.title);
            const articles = this.blogService.getArticlesByTag(
              filteredRoutes,
              this.tag,
              this.isEnglish
            );

            // 排序：最新文章優先
            articles.reverse();

            // 為每篇文章新增日期
            articles.forEach((article) => {
              (article as any).date = this.blogService.getPostDateFormRoute(article.route);
            });

            return articles;
          })
        );
      })
    );
  }

  /**
   * 公開格式化標籤名稱的方法供範本使用
   */
  formatTagName(tag: string): string {
    return this.blogService.formatTagName(tag);
  }
}
