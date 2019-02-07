import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonalStoreComponent } from './personal-store/personal-store.component';
import { UserService } from './service/user.service';
import { HttpService } from './service/http.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
   declarations: [
      AppComponent,
      PersonalStoreComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule
   ],
   providers: [UserService, HttpService],
   bootstrap: [AppComponent]
})
export class AppModule { }
