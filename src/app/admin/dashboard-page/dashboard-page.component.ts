import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PostsService } from '../../shared/services/posts.service';
import { Post } from '../../shared/interfaces';
import { AlertService } from '../shared/services/alert.service';

@Component({
	selector: 'app-dashboard-page',
	templateUrl: './dashboard-page.component.html',
	styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
	
	public posts: Post[] = [];
	public searchStr: string = '';
	private postsSub: Subscription = new Subscription();
	private deleteSub: Subscription = new Subscription();
	
	constructor(
		private postsService: PostsService,
		private alertService: AlertService) {}
	
	public ngOnInit(): void {
		this.postsSub = this.postsService.getAll().subscribe({
			next: posts => {
				this.posts = posts;
			}
		});
	}
	
	public ngOnDestroy(): void {
		if (!this.postsSub.closed)
			this.postsSub.unsubscribe();
		if (!this.deleteSub.closed)
			this.deleteSub.unsubscribe();
	}
	
	public remove(id: string) {
		this.deleteSub = this.postsService.remove(id).subscribe({
			next: () => {
				this.alertService.success('Post deleted!');
				this.posts = this.posts.filter(post => post.id !== id);
			}
		});
	}
}
