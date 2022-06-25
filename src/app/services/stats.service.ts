import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIGS } from '../config/config.dev';


import { GraphResponse } from '../models/graph_response.model';
import { Histogram } from '../models/histogram.model';


@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private host = CONFIGS.host + ':' + CONFIGS.port;

  constructor(private http: HttpClient) { }

  getEndorses() {

    return this.http.get<GraphResponse>(this.host + '/stats/endorsements');
  }

  getComments() {
    return this.http.get<GraphResponse>(this.host + '/stats/comments');
  }

  getEndorsesHistogram() {
    return this.http.get<Histogram>(this.host + '/stats/endorsements/histogram');
  }

  getCommentsHistogram() {
    return this.http.get<Histogram>(this.host + '/stats/comments/histogram');
  }
}
