import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LikeDetail } from '../types/reactions.type';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ReactionsService {
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    public createLike(userId: number, postId: number): Observable<LikeDetail> {
        const body = {
            user: userId,
            post: postId
        };
        return this.http.post<LikeDetail>(environment.API_URL + '/likes/create/', body);
    }

    public deleteLike(likeId: number): Observable<any> {
        return this.http.delete(environment.API_URL + `/likes/delete/${likeId}/`);
    }

    public registerView(postId: number): Observable<any> {
        const body = {
            firebaseUserUUID: this.authService.getAccessToken(),
            post: postId
        };
        return this.http.post<any>(environment.API_URL + '/views/create/', body);
    }
}
