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
   * 規則：以 `/en` 開頭（不分大小寫）或整段僅包含 ASCII 英數字、連字號、斜線視為英文。
   */
  isEnglishRoute(route: string): boolean {
    const path = route || '';
    const startsWithEn = /^\/?en(\/|$)/i.test(path);
    const allAsciiPath = /^\/?[A-Za-z0-9\-\/]+$/.test(path);
    return startsWithEn || allAsciiPath;
  }
}
