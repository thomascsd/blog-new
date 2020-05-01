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
}
