import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { EnHomeComponent } from './en-home/en-home.component';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'en', component: EnHomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule),
  },
  {
    path: 'tags',
    loadChildren: () => import('./tags/tags.module').then((m) => m.TagsModule),
  },
  {
    path: 'en/tags',
    loadChildren: () => import('./tags/tags.module').then((m) => m.TagsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
