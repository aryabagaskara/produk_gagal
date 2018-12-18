
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddKelasComponent } from './kelas/addkelas.component';
import {CategoryModal} from './model/categorymodal.component';


const routes: Routes = [
  {path: '', pathMatch:'full', redirectTo:'/'},
  {path:'home', component: HomeComponent},
  {path:'addkelas', component: AddKelasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
  static components = [HomeComponent,AddKelasComponent];
 }
