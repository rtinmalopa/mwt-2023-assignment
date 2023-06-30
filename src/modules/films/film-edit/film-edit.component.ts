import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { Film } from 'src/entities/film';
import { FilmsService } from '../films.service';

@Component({
  selector: 'app-film-edit',
  templateUrl: './film-edit.component.html',
  styleUrls: ['./film-edit.component.css']
})
export class FilmEditComponent implements OnInit {

  film: Film | undefined;
  saved = false;
  filmid = 0;

  constructor(
    private route: ActivatedRoute, 
    private filmsService: FilmsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(paramMap =>{
        this.filmid = +(paramMap.get("id") || -1)
        return this.filmid;
      }),
      mergeMap(id => this.filmsService.getFilm(id))
    ).subscribe(u => this.film = u);
  }

  saveFilm(film: Film){
    this.filmsService.saveFilm(film).subscribe(
      () => {
        this.router.navigateByUrl("/films")
        this.saved = true
      })
  }

  filmSaved(film: Film) {
    this.saved = true;
    this.film = film;  
    this.router.navigateByUrl("/films");
  }

}
