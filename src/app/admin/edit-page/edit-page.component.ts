import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';

import { PostsService } from '../../shared/services/posts.service';
import { Post } from '../../shared/interfaces';
import { AlertService } from '../shared/services/alert.service';


@Component({
	selector: 'app-edit-page',
	templateUrl: './edit-page.component.html',
	styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
	
	public editForm: FormGroup | null = null;
	public submitted = false;
	private post: Post | null = null;
	private formControls = {};
	private updateSub: Subscription | null = null;
	
	constructor(
		private route: ActivatedRoute,
		private postsService: PostsService,
		private alertService: AlertService,
		private fb: FormBuilder) {}
	
	public ngOnInit(): void {
		this.route.params.pipe(switchMap((params: Params) => {
				return this.postsService.getOneById(params['id']);
			})
		).subscribe({
			next: post => {
				this.post = post;
				this.formControls = {
					title: [post.title, Validators.required],
					text: [post.text, Validators.required],
					author: [post.author, Validators.required]
				};
				this.editForm = this.fb.group(this.formControls);
			}
		});
	}
	
	public ngOnDestroy(): void {
		if (this.updateSub) {
			this.updateSub.unsubscribe();
		}
	}
	
	public submit() {
		if (!this.editForm?.valid) {
			return;
		} else {
			this.submitted = true;
			this.updateSub = this.postsService.update({
				...this.post!,
				title: this.editForm.controls['title'].value,
				text: this.editForm.controls['text'].value
			}).subscribe({
				next: () => {
					this.alertService.success('Post updated!');
					this.submitted = false;
				}
			});
		}
	}
}
