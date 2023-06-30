import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Person } from "src/entities/person";
import { Film } from "src/entities/film";
import { Postava } from "src/entities/postava";
import { FilmsService } from "../films.service";

@Component({
  selector: "app-film-edit-child",
  templateUrl: "./film-edit-child.component.html",
  styleUrls: ["./film-edit-child.component.css"],
})
export class FilmEditChildComponent implements OnChanges {
  @Input() film: Film | undefined;
  @Output() saved = new EventEmitter<Film>();
  reziser: Person[] | undefined;
  postava: Postava[] | undefined;

  title = "";

  filmEditForm = new FormGroup({
    nazov: new FormControl(undefined, [Validators.required, Validators.minLength(5)]),
    slovenskyNazov: new FormControl(undefined, [Validators.required]),
    rok: new FormControl(undefined, [Validators.required, Validators.min(1850), Validators.max(2022), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    imdbID: new FormControl(undefined),
    afi1998: new FormControl(undefined, [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    afi2007: new FormControl(undefined, [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    reziser: new FormArray([]),
    postava: new FormArray([])
  });

  constructor(private filmsService: FilmsService) {}

  get nazov() {
    return this.filmEditForm.get("nazov") as FormControl;
  }

  get rok() {
    return this.filmEditForm.get("rok") as FormControl;
  }

  get slovenskyNazov() {
    return this.filmEditForm.get("slovenskyNazov") as FormControl;
  }

  get imdbID() {
    return this.filmEditForm.get("imdbID") as FormControl;
  }

  get afi1998() {
    return this.filmEditForm.get("afi1998") as FormControl;
  }

  get afi2007() {
    return this.filmEditForm.get("afi2007") as FormControl;
  }

  get reziserInfo() {
    return <FormArray>this.filmEditForm.get("reziser");
  }

  get postavaInfo() {
    return <FormArray>this.filmEditForm.get("postava");
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.film) {
      this.title = this.film.id ? "Film edit" : "Film add";
      this.nazov.setValue(this.film.nazov);
      this.rok.setValue(this.film.rok);
      this.imdbID.setValue(this.film.imdbID);
      this.slovenskyNazov.setValue(this.film.slovenskyNazov);
      this.afi1998.setValue(
        this.film.poradieVRebricku
          ? ["AFI 1998"]
            ? this.film.poradieVRebricku["AFI 1998"]
            : undefined
          : undefined
      );
      this.afi2007.setValue(
        this.film.poradieVRebricku
          ? ["AFI 2007"]
            ? this.film.poradieVRebricku["AFI 2007"]
            : undefined
          : undefined
      );
      this.reziser = this.film.reziser;
      this.postava = this.film.postava;

      for (let r of this.reziser) {
        this.reziserInfo.push(
          new FormGroup({
            krstneMenoReziser: new FormControl(r.krstneMeno),
            stredneMenoReziser: new FormControl(r.stredneMeno),
            priezviskoReziser: new FormControl(r.priezvisko),
            idReziser: new FormControl(r.id)
          })
        );
      }

      for (let p of this.postava) {
        this.postavaInfo.push(
          new FormGroup({
            nazovPostava: new FormControl(p.postava),
            dolezitostPostava: new FormControl(p.dolezitost),
            krstneMenoHerec: new FormControl(p.herec.krstneMeno),
            stredneMenoHerec: new FormControl(p.herec.stredneMeno),
            priezviskoHerec: new FormControl(p.herec.priezvisko),
            idHerec: new FormControl(p.herec.id)
          })
        );
      }
    }
  }
  
  pridatRezisera() {
    this.reziserInfo.push(
      new FormGroup({
        krstneMenoReziser: new FormControl(undefined),
        stredneMenoReziser: new FormControl(undefined),
        priezviskoReziser: new FormControl(undefined),
        idReziser: new FormControl(undefined),
      })
    );
  }

  odstranitRezisera(rez: number) {
    this.reziserInfo.removeAt(rez);
  }

  pridatPostavu() {
    this.postavaInfo.push(
      new FormGroup({
        nazovPostava: new FormControl(undefined),
        dolezitostPostava: new FormControl(undefined),
        priezviskoHerec: new FormControl(undefined),
        krstneMenoHerec: new FormControl(undefined),
        stredneMenoHerec: new FormControl(undefined),
        idHerec: new FormControl(undefined),
      })
    );
  }

  odstranitPostavu(pos: number) {
    this.postavaInfo.removeAt(pos);
  }

  onSubmit() {
    let poradieVRebricku = {};
    if (this.afi1998) {
      poradieVRebricku = {...poradieVRebricku, "AFI 1998": this.afi1998.value};
    }
    if (this.afi2007) {
      poradieVRebricku = {...poradieVRebricku, "AFI 2007": this.afi2007.value};
    }

    let reziseri: Person[] = [];
    for (let r = 0; r < this.reziserInfo.length; r++) {
      reziseri.push(
        new Person(
          this.reziserInfo.at(r).get("krstneMenoReziser")?.value,
          this.reziserInfo.at(r).get("stredneMenoReziser")?.value,
          this.reziserInfo.at(r).get("priezviskoReziser")?.value,
          this.reziserInfo.at(r).get("idReziser")?.value
        )
      );
    }

    let postavy: Postava[] = [];
    for (let p = 0; p < this.postavaInfo.length; p++) {
      postavy.push(
        new Postava(
          this.postavaInfo.at(p).get("nazovPostava")?.value,
          this.postavaInfo.at(p).get("dolezitostPostava")?.value,
          new Person(
            this.postavaInfo.at(p).get("krstneMenoHerec")?.value,
            this.postavaInfo.at(p).get("stredneMenoHerec")?.value,
            this.postavaInfo.at(p).get("priezviskoHerec")?.value,
            this.postavaInfo.at(p).get("idHerec")?.value
          )
        )
      );
    }

    const filmToSave = new Film(
      this.nazov.value,
      this.rok.value,
      this.slovenskyNazov.value,
      this.imdbID.value,
      reziseri,
      postavy,
      poradieVRebricku,
      this.film?.id,
    );
    this.filmsService.saveFilm(filmToSave).subscribe((savedFilm) => {
      this.saved.emit(savedFilm);
    });
  }

  stringify(error: any): string {
    return JSON.stringify(error);
  }
}
