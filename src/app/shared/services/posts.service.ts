import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { FbCreatePostResponse, Post } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class PostsService {
	constructor(private http: HttpClient) {}
	
	public create(post: Post): Observable<Post> {
		return this.http.post<Post | any>(`${environment.fbDbUrl}/posts.json`, post)
			.pipe(map((response: FbCreatePostResponse) => {
				return {
					id: response.name,
					...post,
					date: new Date(post.date)
				};
			}));
	}
	
	public getOneById(id: string): Observable<Post> {
		return this.http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`).pipe(map((post: Post) => {
			return {...post, id, date: new Date(post.date)};
		}));
	}
	
	public getAll(): Observable<Post[]> {
		return this.http.get<Post[]>(`${environment.fbDbUrl}/posts.json`)
			.pipe(map((response: {[key: string]: any}) => {
				return Object.keys(response)
					.map((key) => ({
						...response[key],
						id: key,
						date: new Date(response[key].date)
					}));
			}));
	}
	
	public update(post: Post): Observable<Post> {
		return this.http.patch<Post>(`${environment.fbDbUrl}/posts/${post.id}.json`, post);
	}
	
	public remove(id: string): Observable<any> {
		return this.http.delete(`${environment.fbDbUrl}/posts/${id}.json`);
	}
}
