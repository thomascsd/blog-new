import { Component, OnInit } from '@angular/core';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlogService, TagInfo } from '../core/blog.service';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss'],
})
export class TagsListComponent implements OnInit {
  tags$: Observable<TagInfo[]>;
  isEnglish = false;

  constructor(private scullyService: ScullyRoutesService, private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadTags();
  }

  private loadTags(): void {
    this.tags$ = (this.scullyService.available$ as any).pipe(
      map((routes: ScullyRoute[]) => {
        const filteredRoutes = routes.filter((route) => !!route.title);
        return this.blogService.getAllTags(filteredRoutes, this.isEnglish);
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
