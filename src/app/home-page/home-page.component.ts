import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { PostsService } from '../shared/services/posts.service';
import { Post } from '../shared/interfaces';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
	
	public posts$: Observable<Post[]> | null = null;
	
	constructor(private postsService: PostsService) {}
	
	public ngOnInit(): void {
		this.posts$ = this.postsService.getAll();
	}
}
