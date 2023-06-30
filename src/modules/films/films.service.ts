import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { Film } from 'src/entities/film';
import { UsersService } from 'src/services/users.service';
import { MessageService } from "src/services/message.service";

export interface FilmsResponse {
  items: Film[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class FilmsService {

  url = this.usersService.url;

  get token() {
    return this.usersService.token;
  }

  constructor(private http: HttpClient, private usersService: UsersService, private messageService: MessageService
    ) { }

  getHeader():
  | {
      headers?: { "X-Auth-Token": string };
      params?: HttpParams;
    }
  | undefined {
  return this.token
    ? {
        headers: {
          "X-Auth-Token": this.token,
        },
      }
    : undefined;
}


  getFilms(orderBy?:string, descending?:boolean, indexFrom?: number, indexTo?: number, search?: string): Observable<FilmsResponse> {
    let options: {
      headers? : {[header:string]: string},
      params?: HttpParams
    } | undefined = this.getHeader();
    
    if (orderBy || descending || indexFrom || indexTo || search) {
      options = { ...(options || {}), params: new HttpParams()}
      if (orderBy) options.params = options.params?.set('orderBy', orderBy);
      if (descending) options.params = options.params?.set('descending', descending);
      if (indexFrom) options.params = options.params?.set('indexFrom', indexFrom);
      if (indexTo) options.params = options.params?.set('indexTo', indexTo);
      if (search) options.params = options.params?.set('search', search);
    }
    
    return this.http.get<FilmsResponse>(this.url + 'films', options).pipe(
      catchError(error => this.usersService.processError(error))
    );
  }

  getFilm(id: number): Observable<Film> {
    const url = this.usersService.url + "films/"
    let httpOptions = this.getHeader();
    return this.http.get<Film>(url + id, httpOptions).pipe(
      tap((resp) => console.log(resp)),
      catchError((error) => this.processHttpError(error))
    );
  }

  saveFilm(film: Film): Observable<Film> {
    const url = this.usersService.url + "films/"
    let httpOptions = this.getHeader();
    return this.http.post<Film>(url, film, httpOptions).pipe(
      tap((resp) => this.messageService.successMessage("Informácie o filme " + resp.nazov + " (" + resp.rok + ") boli úspešne uložené.")),
      catchError((error) => this.processHttpError(error))
    );
  }

  public processHttpError(error: any): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.messageService.errorMessage("Server je nedostupný.");
      } else {
        if (error.status === 403) {
          const message = error.error.errorMessage || JSON.parse(error.error.errorMessage);
          if (message === "manage_films permission needed") {
            this.messageService.errorMessage("Nemáte oprávnenie na manažovanie zoznamu filmov.");
          } else {
            this.messageService.errorMessage(message);
          }
        } else if (error.status >= 500) {
            this.messageService.errorMessage("Server má problém, kontaktujte administrátora!");
            console.error("Server error", error);
        }
      }
    } else {
      this.messageService.errorMessage("Oprav si klienta, programátor :)");
      console.error("Server error", error);
    }
    return EMPTY;
  }


}

