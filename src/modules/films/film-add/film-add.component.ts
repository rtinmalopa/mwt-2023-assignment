import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Film } from 'src/entities/film';

@Component({
  selector: 'app-film-add',
  templateUrl: './film-add.component.html',
  styleUrls: ['./film-add.component.css']
})
export class FilmAddComponent implements OnInit {

  film = new Film('', 0, '');

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  filmSaved() {
    this.router.navigateByUrl('/films');
  }

}
