import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmsListComponent } from './films-list/films-list.component';

const routes: Routes = [
  {path:"", component: FilmsListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule { }
