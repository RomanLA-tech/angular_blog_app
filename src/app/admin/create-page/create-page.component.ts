import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../shared/services/auth.service';
import { Post } from '../../shared/interfaces';
import { PostsService } from '../../shared/services/posts.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
	selector: 'app-create-page',
	templateUrl: './create-page.component.html',
	styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnDestroy {
	
	readonly createPostForm: FormGroup = this.fb.group({
		title: ['', Validators.required],
		text: [''],
		author: ['', Validators.required]
	});
	private postSub: Subscription = new Subscription();
	
	constructor(
		public auth: AuthService,
		private alertService: AlertService,
		private postService: PostsService,
		private fb: FormBuilder) {}
	
	public ngOnDestroy(): void {
		this.postSub.unsubscribe();
	}
	
	public submit() {
		if (!this.createPostForm.valid) {
			return;
		} else {
			const post: Post = {
				title: this.createPostForm.controls['title'].value,
				text: this.createPostForm.controls['text'].value,
				author: this.createPostForm.controls['author'].value,
				date: new Date()
			};
			this.postSub = this.postService.create(post).subscribe({
				next: () => {
					this.alertService.success('Post created successfully');
					this.createPostForm.reset();
				}
			});
		}
	}
}
