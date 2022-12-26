import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import { PostsService } from '../shared/services/posts.service';
import { Post } from '../shared/interfaces';

@Component({
	selector: 'app-post-page',
	templateUrl: './post-page.component.html',
	styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {
	
	public post$: Observable<Post> | null = null;
	
	constructor(private route: ActivatedRoute,
		private postsService: PostsService) {}
	
	public ngOnInit(): void {
		this.post$ = this.route.params.pipe(switchMap((params: Params) => {
			return this.postsService.getOneById(params['id']);
		}));
	}
}
