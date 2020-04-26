import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ScullyLibModule } from '@scullyio/ng-lib';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SkillTreeComponent } from './skill-tree/skill-tree.component';
import { BlogNavComponent } from './blog-nav/blog-nav.component';
import { PostHeaderComponent } from './post-header/post-header.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SkillTreeComponent,
    BlogNavComponent,
    PostHeaderComponent,
  ],
  imports: [CommonModule, ScullyLibModule, RouterModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    SkillTreeComponent,
    BlogNavComponent,
    PostHeaderComponent,
  ],
})
export class SharedModule {}
