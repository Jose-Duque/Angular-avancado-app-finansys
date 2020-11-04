import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError, flatMap } from "rxjs/operators";

import { Entry } from "../shared/entry.model";

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = 'api/entries'

  constructor(private http: HttpClient) { }

  getAll(): Observable<Entry[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handlError),
      map(this.jsonDataToEntries)
    )
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handlError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: Entry): Observable<Entry> {
    return this.http.post(this.apiPath, entry).pipe(
      catchError(this.handlError),
      map(this.jsonDataToEntry)
    )
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`
    return this.http.put(url, entry).pipe(
      catchError(this.handlError),
      map(() => entry)
    )
  }

  delete(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`
    return this.http.delete(url).pipe(
      catchError(this.handlError),
      map(() => null)
    )
  }

  // Private Methods
  jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(element => entries.push(element as Entry));
    return entries;
  }

  jsonDataToEntry(jsonData: any): Entry {
    return jsonData as Entry;
  }

  handlError(error: any): Observable<any> {
    console.log('ERRO NA REQUISÃO -->', error);
    return throwError(error);
  }
}
