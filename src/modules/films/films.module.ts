import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmsRoutingModule } from './films-routing.module';
import { FilmsListComponent } from './films-list/films-list.component';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FilmEditComponent } from './film-edit/film-edit.component';
import { FilmAddComponent } from './film-add/film-add.component';
import { FilmEditChildComponent } from './film-edit-child/film-edit-child.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FilmsListComponent,
    FilmEditComponent,
    FilmAddComponent,
    FilmEditChildComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FilmsRoutingModule,
    ReactiveFormsModule
  ]
})
export class FilmsModule { }
