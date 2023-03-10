import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { AuthService } from '../../admin/shared/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(
		private auth: AuthService,
		private router: Router) {}
	
	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (this.auth.isAuthenticated()) {
			req = req.clone({
					params: req.params.set('auth', this.auth.token!)
				}
			);
		}
		return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
			console.error('[Interceptor error]:', error);
			if (error.status === 401) {
				this.auth.logout();
				this.router.navigate(['/admin', 'login'], {
					queryParams: {authFailed: true}
				});
			}
			return throwError(() => error);
		}));
	}
}
