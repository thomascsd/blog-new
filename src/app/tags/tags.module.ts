import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TagsListComponent } from './tags-list.component';
import { TagDetailComponent } from './tag-detail.component';

const routes: Routes = [
  {
    path: '',
    component: TagsListComponent,
  },
  {
    path: ':tag',
    component: TagDetailComponent,
  },
];

@NgModule({
  declarations: [TagsListComponent, TagDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class TagsModule {}
