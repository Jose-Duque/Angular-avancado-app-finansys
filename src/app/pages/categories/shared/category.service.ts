import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError, flatMap } from "rxjs/operators";

import { Category } from "./category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = 'api/category'

  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handlError),
      map(this.jsonDataToCategories)
    )
  }

  getById(id: number): Observable<Category> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handlError),
      map(this.jsonDataToCategory)
    )
  }

  create(category: Category): Observable<Category> {
    return this.http.post(this.apiPath, category).pipe(
      catchError(this.handlError),
      map(this.jsonDataToCategory)
    )
  }

  update(category: Category): Observable<Category> {
    const url = `${this.apiPath}/${category.id}`
    return this.http.put(url, category).pipe(
      catchError(this.handlError),
      map(() => category)
    )
  }

  delete(id: number): Observable<Category> {
    const url = `${this.apiPath}/${id}`
    return this.http.delete(url).pipe(
      catchError(this.handlError),
      map(() => null)
    )
  }

  // Private Methods
  jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach(element => categories.push(element as Category));
    return categories;
  }

  jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category;
  }

  handlError(error: any): Observable<any> {
    console.log('ERRO NA REQUISÃO -->', error);
    return throwError(error);
  }
}
