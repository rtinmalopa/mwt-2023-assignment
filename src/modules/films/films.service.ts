import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Film } from 'src/entities/film';
import { UsersService } from 'src/services/users.service';

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

  constructor(private http: HttpClient, private usersService: UsersService) { }

  getHeader() {
    if (this.token) {
      return {headers: {'X-Auth-Token': this.token}}
    }
    return undefined;
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

}
