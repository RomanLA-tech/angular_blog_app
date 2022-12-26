import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService, AlertType } from '../../services/alert.service';

@Component({
	selector: 'app-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
	
	@Input() delay: number = 5000;
	
	public text: string = '';
	public type: AlertType = 'success';
	private alertSub: Subscription | null = null;
	
	constructor(private alertService: AlertService) {}
	
	public ngOnInit(): void {
		this.alertSub = this.alertService.alert$.subscribe({
			next: alert => {
				this.type = alert.type;
				this.text = alert.text;
				
				const timeout = setTimeout(() => {
					clearTimeout(timeout);
					this.text = '';
				}, this.delay);
			}
		});
	}
	
	public ngOnDestroy(): void {
		if (this.alertSub) {
			this.alertSub?.unsubscribe();
		}
	}
}
