import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { TimerComponent } from './../features/timer/timer.component';

const appRoutes: Routes = [
  { path: 'timer', component: TimerComponent }
  
];

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent
  ],
  imports: [
    DragDropModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
