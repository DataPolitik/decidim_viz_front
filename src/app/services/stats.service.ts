import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GraphResponse } from '../models/graph_response.model';
import { Histogram } from '../models/histogram.model';

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

  getEndorsesHistogram() {
    return this.http.get<Histogram>('http://127.0.0.1:8000/stats/endorsements/histogram');
  }

  getCommentsHistogram() {
    return this.http.get<Histogram>('http://127.0.0.1:8000/stats/comments/histogram');
  }
}
