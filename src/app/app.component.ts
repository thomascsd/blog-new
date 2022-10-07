import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
declare let gtag: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private metaService: Meta) {}

  ngOnInit() {
    this.metaService.addTags([
      { name: 'keywords', content: 'JavaScript Node.js Express.js TypeScript C# .NET Blog' },
      { name: 'description', content: 'JavaScript And .NET Blog' },
    ]);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('event', 'page_view', event.url);
      }
    });
  }
}
