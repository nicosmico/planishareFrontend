import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AcademicLevel, Axis, PostDetail, PostsQueryParams, RealPostsQueryParams, Subject } from '../types/posts.type';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private api_url = environment.API_URL;

    constructor(
        private http: HttpClient
    ) { }

    public getPosts(queryParams: PostsQueryParams): Observable<PostDetail[]> {
        const params: RealPostsQueryParams = {
            page: queryParams.page ?? 1,
            search: queryParams.search ?? '',
            user__id: queryParams.userId ?? '',
            academic_level__id: queryParams.academicLevel?.id ?? '',
            axis__subject__id: queryParams.subject?.id ?? '',
            axis__id: queryParams.axis?.id ?? '',
            ordering: queryParams.ordering ?? ''
        };
        return this.http.get<PostDetail[]>(this.api_url + '/posts/', {
            params: params
        });
    }

    public getLatestPosts(): Observable<PostDetail[]> {
        return this.http.get<PostDetail[]>(this.api_url + '/posts/latest/');
    }

    public getMostLikedPosts(): Observable<PostDetail[]> {
        return this.http.get<PostDetail[]>(this.api_url + '/posts/most-liked/');
    }

    // Academic Level, Subjects and Axis
    public getAcademicLevels(): Observable<AcademicLevel[]> {
        return this.http.get<AcademicLevel[]>(this.api_url + '/academic-levels/');
    }

    public getSubjects(): Observable<Subject[]> {
        return this.http.get<Subject[]>(this.api_url + '/subjects/');
    }

    public getAxes(): Observable<Axis[]> {
        return this.http.get<Axis[]>(this.api_url + '/axis/');
    }
}
