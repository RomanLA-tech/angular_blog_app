import { Pipe, PipeTransform } from '@angular/core';

import { Post } from '../../../shared/interfaces';

@Pipe({name: 'searchPosts'})
export class SearchPostPipe implements PipeTransform {
	public transform(posts: Post[], search = ''): Post[] {
		if (!search.trim()) {
			return posts;
		}
		return posts.filter(post => {
			return post.title.toLowerCase().includes(search.toLowerCase());
		});
	}
}
