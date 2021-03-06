import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AcademicLevel, Axis, PostDetail, PostForm, PostPageable, PostsQueryParams, RealPostsQueryParams, Subject, SubjectWithAxis } from '../types/posts.type';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private academicLevels?: AcademicLevel[];
    private subjects?: Subject[];
    private axes?: Axis[];
    private subjectWithAxes?: SubjectWithAxis[];

    constructor(
        private http: HttpClient
    ) { }

    public getPosts(queryParams: PostsQueryParams): Observable<PostPageable> {
        const params: RealPostsQueryParams = {
            page: queryParams.page ?? 1,
            search: queryParams.search ?? '',
            user__id: queryParams.userId ?? '',
            academic_level__id: queryParams.academicLevel ?? '',
            axis__subject__id: queryParams.subject ?? '',
            axis__id: queryParams.axis ?? '',
            ordering: queryParams.ordering ?? ''
        };

        return this.http.get<PostPageable>(environment.apiUrl + '/posts/', {
            params
        });
    }

    public getLatestPosts(): Observable<PostDetail[]> {
        return this.http.get<PostDetail[]>(environment.apiUrl + '/posts/latest/');
    }

    public getPopularPosts(): Observable<PostDetail[]> {
        return this.http.get<PostDetail[]>(environment.apiUrl + '/posts/popular/');
    }

    public getMostLikedPosts(): Observable<PostDetail[]> {
        return this.http.get<PostDetail[]>(environment.apiUrl + '/posts/most-liked/');
    }

    public getPostById(postId: number): Observable<PostDetail> {
        return this.http.get<PostDetail>(environment.apiUrl + `/posts/${postId}/`);
    }

    public deletePostById(postId: number): Observable<PostDetail> {
        return this.http.delete<PostDetail>(environment.apiUrl + `/posts/delete/${postId}/`);
    }

    public updatePostById(postId: number, postData: PostForm): Observable<PostDetail> {
        return this.http.patch<PostDetail>(environment.apiUrl + `/posts/update/${postId}/`, postData);
    }

    public createPost(postData: PostForm): Observable<any> {
        return this.http.post(environment.apiUrl + '/posts/create/', postData);
    }

    // Academic Level, Subjects and Axis
    public getAcademicLevels(): Observable<AcademicLevel[]> {
        if (!!!this.academicLevels) {
            return this.http.get<AcademicLevel[]>(environment.apiUrl + '/academic-levels/').pipe(
                tap(data => this.academicLevels = data)
            );
        }
        return of(this.academicLevels);
    }

    public getSubjects(): Observable<Subject[]> {
        if (!!!this.subjects) {
            return this.http.get<Subject[]>(environment.apiUrl + '/subjects/').pipe(
                tap(data => this.subjects = data)
            );
        }
        return of(this.subjects);
    }

    public getAxes(): Observable<Axis[]> {
        if (!!!this.axes) {
            return this.http.get<Axis[]>(environment.apiUrl + '/axis/').pipe(
                tap(data => this.axes = data)
            );
        }
        return of(this.axes);
    }

    public getSubjectWithAxis(): Observable<SubjectWithAxis[]> {
        if (!!!this.subjectWithAxes) {
            return this.http.get<SubjectWithAxis[]>(environment.apiUrl + '/subjects-with-axis/').pipe(
                tap(data => this.subjectWithAxes = data)
            );
        }
        return of(this.subjectWithAxes);
    }
}
