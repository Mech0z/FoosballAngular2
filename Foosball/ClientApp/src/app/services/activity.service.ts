import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './headers.service';
import { GetStatusResponse } from '../models/GetStatusResponse';
import { Observable } from 'rxjs';

@Injectable()
export class ActivityService {
  constructor(private http: HttpClient, private headersService: HeadersService) { }

  getActivity(): Observable<GetStatusResponse> {
    return this.http.get<GetStatusResponse>('/api/IoT/GetStatus');
  }
}
