import { Component, AfterViewInit } from '@angular/core';

declare var docsearch: any;

@Component({
  selector: 'app-blog-nav',
  templateUrl: './blog-nav.component.html',
  styleUrls: ['./blog-nav.component.scss'],
})
export class BlogNavComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    docsearch({
      appId: '2XJACE5WR2',
      apiKey: '46a06c9f83f755da664540969c8bf344',
      indexName: 'thomascsdio',
      container: '#docsearch',
      debug: false,
    });
  }
}
