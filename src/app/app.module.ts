import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SharedModule } from './shared/shared.module';
import { EnHomeComponent } from './en-home/en-home.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, AboutComponent, EnHomeComponent],
  imports: [BrowserModule, AppRoutingModule, ScullyLibModule, SharedModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
