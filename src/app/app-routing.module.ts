import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalStoreComponent } from './personal-store/personal-store.component';

const routes: Routes = [
  { path: 'personal', component: PersonalStoreComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
