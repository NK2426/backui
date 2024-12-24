import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TAGS } from '../models/tag';

import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TagService {

    TagApiUrl: string = `${environment.CATALOG_BASE_URL}/tags`;


    constructor(private http: HttpClient, private env: EnvService) { }

    // CREATE
    createTag(formData: Partial<TAGS.Tag>): Observable<TAGS.TagHttpResponse> {
        return this.http.post<TAGS.TagHttpResponse>(this.TagApiUrl, formData)
            .pipe(map(res => res));
    }

    // READ ALL
    getTagList(params: {}): Observable<TAGS.TagPaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<TAGS.TagPaginate>(this.TagApiUrl, option);
    }

    // READ ONE
    getTagById(tagID: string): Observable<TAGS.TagHttpResponse> {
        return this.http.get<TAGS.TagHttpResponse>(this.TagApiUrl + `/${tagID}`);
    }


    // UPDATE
    updateTag(tagID: string, formdata: any): Observable<TAGS.TagHttpResponse> {
        return this.http.put<TAGS.TagHttpResponse>(this.TagApiUrl + '/' + tagID, formdata)
            .pipe(map(res => res))
    }

    // DELETE
    deleteTag(tagID: string): Observable<TAGS.TagHttpResponse> {
        return this.http.delete<TAGS.TagHttpResponse>(this.TagApiUrl + '/' + tagID);
    }



}
