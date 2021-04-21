import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Contact } from './contact';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private apiUrl = 'https://2o08kelx1a.execute-api.eu-west-2.amazonaws.com/prod/';

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
  	let errorMessage = 'Unknown error!'
  	if (error.error instanceof ErrorEvent) {
  		errorMessage = `Error: ${error.error.message}`;
  	} else {
  		errorMessage = `Error: ${error.status}\nMessage: ${error.message}`;
 	}
 	return throwError(errorMessage);
  }

  public getLocation() {
  	return this.httpClient
  	  .get(this.apiUrl + 'locations')
  	  .pipe(retry(2), catchError(this.handleError));
  }

  public postContactForm(input) {
  	return this.httpClient
  	  .post(this.apiUrl + 'contactform', input)
  	  .pipe(retry(2), catchError(this.handleError));
  }

}