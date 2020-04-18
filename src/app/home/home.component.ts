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
      map((routes) => routes.filter((route) => !!route.title))
    );
  }

  getImageUrl(imageUrl: string) {
    return imageUrl || 'assets/images/bg1920x872.jpg';
  }
}
