import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [BlogComponent],
  imports: [CommonModule, BlogRoutingModule, ScullyLibModule, SharedModule],
})
export class BlogModule {}
