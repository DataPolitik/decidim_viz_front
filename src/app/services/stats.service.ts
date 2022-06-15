import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GraphResponse } from '../models/graph_response.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient) { }

  getEndorses() {
    return this.http.get<GraphResponse>('http://127.0.0.1:8000/stats/endorsements');
  }

  getComments() {
    return this.http.get<GraphResponse>('http://127.0.0.1:8000/stats/comments');
  }
}
