import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { User } from '../../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
	
	public submitted = false;
	public message: string = '';
	readonly form: FormGroup = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(8)]]
	});
	
	constructor(
		public auth: AuthService,
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private alertService: AlertService) {}
	
	public ngOnInit(): void {
		this.route.queryParams.subscribe((params: Params) => {
			if (params['loginAgain']) {
				this.message = 'Please login firstly';
			} else if (params['authFailed']) {
				this.message = 'Session expired, please login again';
			}
		});
	}
	
	public submit() {
		if (this.form.invalid) {
			return;
		} else {
			this.submitted = true;
			
			const user: User = {
				email: this.form.controls['email'].value,
				password: this.form.controls['password'].value
			};
			
			this.auth.login(user).subscribe({
				next: () => {
					this.form.reset();
					this.router.navigate(['/admin', 'dashboard']);
					this.alertService.success('Successful login');
					this.submitted = false;
				},
				error: () => {
					this.alertService.danger('Some error occurred');
					this.submitted = false;
				}
			});
		}
	}
}
