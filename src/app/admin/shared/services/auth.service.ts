import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';

import { FbAuthResponse, User } from '../../../shared/interfaces';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
	
	public error$: Subject<string> = new Subject<string>();
	
	constructor(private http: HttpClient) {}
	
	public get token(): string | null {
		const expDate = new Date(Number(localStorage.getItem('fb-token-exp')));
		if (new Date() > expDate) {
			this.logout();
			return null;
		}
		return localStorage.getItem('fb-token');
	}
	
	public isAuthenticated(): boolean {
		return !!this.token;
	};
	
	public login(user: User): Observable<FbAuthResponse | null> {
		user.returnSecureToken = true;
		return this.http.post<FbAuthResponse>(`${environment.fbLink}${environment.apiKey}`, user)
			.pipe(
				tap(this.setToken),
				catchError(this.handleError.bind(this))
			);
	}
	
	public logout() {
		this.setToken(null);
	}
	
	private handleError(error: HttpErrorResponse) {
		const {message} = error.error.error;
		switch (message) {
			case 'INVALID_EMAIL':
				this.error$.next('Incorrect email');
				break;
			case 'INVALID_PASSWORD':
				this.error$.next('Incorrect password');
				break;
			case 'EMAIL_NOT_FOUND':
				this.error$.next('User not found');
				break;
		}
		return throwError(() => error);
	}
	
	private setToken(response: FbAuthResponse | null) {
		if (response) {
			const expDate = new Date(new Date().getTime() + (+response.expiresIn * 1000));
			localStorage.setItem('fb-token', response.idToken);
			localStorage.setItem('fb-token-exp', expDate.toString());
		} else {
			localStorage.clear();
		}
	}
}
