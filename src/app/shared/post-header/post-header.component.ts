import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrls: ['./post-header.component.scss'],
})
export class PostHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() postDate: string;
  @Input() bgImageUrl: string;

  imageStyle: object;

  constructor() {}

  ngOnInit(): void {
    const defaultUrl = { 'background-image': `url("assets/images/bg1920x872.jpg")` };
    if (this.bgImageUrl) {
      this.imageStyle = { 'background-image': `url("${this.bgImageUrl}")` };
    } else {
      this.imageStyle = defaultUrl;
    }
  }
}
