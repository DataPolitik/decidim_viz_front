import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Endorsements } from '../models/endorsements.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient) { }

  getEndorses() {
    return this.http.get<Endorsements>('http://127.0.0.1:8000/stats/endorsements');
  }
}
