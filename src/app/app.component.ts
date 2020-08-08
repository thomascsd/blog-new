import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare let gtag: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // this.router.events
    //   .pipe(
    //     distinctUntilChanged((previous: any, current: any) => {
    //       if (current instanceof NavigationEnd) {
    //         return previous.url === current.url;
    //       }
    //       return true;
    //     })
    //   )
    //   .subscribe((x: any) => {
    //     gtag('event', 'page_view', { page_path: x.url });
    //   });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('event', 'page_view', event.url);
      }
    });
  }
}
