import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
declare let gtag: any;

// <meta property="og:site_name" content={siteConfig.title} />
// <meta property="og:locale" content={siteConfig.lang} />
// <meta property="og:type" content="website" />

// <meta property="og:title" content={siteConfig.title} />
// <meta name="twitter:title" content={siteConfig.title} />

// <meta property="og:description" content={siteConfig.description} />
// <meta name="twitter:description" content={siteConfig.description} />

// <meta property="og:url" content={siteConfig.url} />
// <meta property="twitter:url" content={siteConfig.url} />

// <meta property="og:image" content={new URL(siteConfig.cover, siteConfig.url).href} />
// <meta name="twitter:image" content={new URL(siteConfig.cover, siteConfig.url).href} />
// <meta name="twitter:card" content="summary_large_image" />

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
      { name: 'og:title', content: '' },
      { name: 'twitter:title', content: '' },
      { name: 'og:site_name', content: '' },
      { name: 'og:locale', content: 'zh-tw' },
      { name: 'og:type', content: 'website' },
      { name: 'og:description', content: '' },
      { name: 'twitter:description', content: '' },
      { name: 'og:url', content: location.href },
      { name: 'twitter:url', content: location.href },
    ]);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('event', 'page_view', event.url);
      }
    });
  }
}
