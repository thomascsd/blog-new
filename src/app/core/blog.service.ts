import { Injectable } from '@angular/core';

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
   * 規則：以 `/en` 開頭（不分大小寫)
   */
  isEnglishRoute(route: string): boolean {
    const path = route || '';
    const startsWithEn = path.indexOf('/en/') !== -1;
    return startsWithEn;
  }
}
