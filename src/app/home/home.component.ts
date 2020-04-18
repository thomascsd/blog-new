import { Component, OnInit } from '@angular/core';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  links$: Observable<ScullyRoute[]>;

  constructor(private scullyService: ScullyRoutesService) {}

  ngOnInit(): void {
    this.links$ = this.scullyService.available$.pipe(
      map((routes) => {
        return routes
          .filter((route) => !!route.title)
          .sort((a, b) => {
            const dateRex = /(\d{4}-\d{2}-\d{2})/g;
            const dateA = dateRex.exec(a.route)[0];
            const dateB = dateRex.exec(b.route)[0];
            return dateA > dateB ? -1 : 1;
          });
      })
    );
  }

  getImageUrl(imageUrl: string) {
    return imageUrl || 'assets/images/bg1920x872.jpg';
  }
}
