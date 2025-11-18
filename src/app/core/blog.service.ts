import { Injectable } from '@angular/core';
import { ScullyRoute } from '@scullyio/ng-lib';

export interface TagInfo {
  tag: string;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor() {}

  getPostDateFormRoute(route: string) {
    const dateRex = /(\d{4}-\d{2}-\d{2})/g;
    return dateRex.exec(route)[0];
  }

  /**
   * 判斷路由是否為英文路徑。
   * 規則：以 `/en` 開頭（不分大小寫）或整段僅包含 ASCII 英數字、連字號、斜線視為英文。
   */
  isEnglishRoute(route: string): boolean {
    const path = route || '';
    const startsWithEn = /^\/?en(\/|$)/i.test(path);
    const allAsciiPath = /^\/?[A-Za-z0-9\-\/]+$/.test(path);
    return startsWithEn || allAsciiPath;
  }

  /**
   * 從路由物件中提取 tags 陣列
   * @param route ScullyRoute 物件
   * @returns tags 陣列，如果沒有則返回空陣列
   */
  getTagsFromRoute(route: ScullyRoute): string[] {
    return (route as any).tags || [];
  }

  /**
   * 格式化標籤名稱：首字母大寫
   * @param tag 標籤名稱（全小寫、空格用連字號表示）
   * @returns 格式化後的標籤名稱
   */
  formatTagName(tag: string): string {
    if (!tag) return '';
    // 將連字號轉回空格，然後首字母大寫
    const words = tag.split('-');
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  }

  /**
   * 從所有路由中收集所有標籤並計數
   * @param routes 所有 ScullyRoute 路由
   * @param isEnglish 是否只取英文路由（預設 false，即取中文路由）
   * @returns 排序後的 TagInfo 陣列 (依計數降序，相同計數依字母序)
   */
  getAllTags(routes: ScullyRoute[], isEnglish = false): TagInfo[] {
    const tagMap = new Map<string, number>();

    routes.forEach((route) => {
      // 過濾路由：如果 isEnglish=true 只取英文路由，反之只取中文路由
      const routeIsEnglish = this.isEnglishRoute(route.route);
      if (isEnglish !== routeIsEnglish) {
        return;
      }

      const tags = this.getTagsFromRoute(route);
      tags.forEach((tag) => {
        const count = tagMap.get(tag) || 0;
        tagMap.set(tag, count + 1);
      });
    });

    // 將 Map 轉換為陣列並排序
    const tagInfos = Array.from(tagMap.entries()).map(([tag, count]) => ({
      tag,
      count,
    }));

    // 依計數降序排列，相同計數則依字母序
    tagInfos.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.tag.localeCompare(b.tag);
    });

    return tagInfos;
  }

  /**
   * 取得特定標籤下的所有文章
   * @param routes 所有 ScullyRoute 路由
   * @param tag 標籤名稱
   * @param isEnglish 是否只取英文路由（預設 false，即取中文路由）
   * @returns 包含該標籤的路由陣列
   */
  getArticlesByTag(routes: ScullyRoute[], tag: string, isEnglish = false): ScullyRoute[] {
    return routes.filter((route) => {
      const routeIsEnglish = this.isEnglishRoute(route.route);
      if (isEnglish !== routeIsEnglish) {
        return false;
      }
      const tags = this.getTagsFromRoute(route);
      return tags.includes(tag);
    });
  }
}
