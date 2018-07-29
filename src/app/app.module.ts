import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {ListService} from './list.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
// import of component
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    CreateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'todolist', component: ListComponent, pathMatch: 'full' },
      { path: 'create', component: CreateComponent},
      { path: '', redirectTo: 'todolist', pathMatch: 'full' },
      { path: '*', component: ListComponent },
      { path: '**', component: ListComponent },
      

    ])
  ],
  
  providers: [ListService,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
