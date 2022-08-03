import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIGS } from '../config/config.dev';
import { CategoryResponse } from '../models/category.model';


import { GraphResponse } from '../models/graph_response.model';
import { Histogram } from '../models/histogram.model';
import { LanguagesCount } from '../models/languages.count.model';
import { ProposalResponse } from '../models/proposal.model';


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

  getProposalsBySupports(limit: number){
    return this.http.get<ProposalResponse>(this.host + '/stats/proposals/supports/'+limit);
  }

  getProposalsByComments(limit: number){
    return this.http.get<ProposalResponse>(this.host + '/stats/proposals/comments/'+limit);
  }

  getCategories(){
    return this.http.get<CategoryResponse>(this.host + '/stats/categories/');
  }

  getCategoriesByProposals(limit: number){
    return this.http.get<CategoryResponse>(this.host + '/stats/categories/proposals/'+limit);
  }

  getCategoriesByComments(){
    return this.http.get<CategoryResponse>(this.host + '/stats/categories/comments/');
  }

  getLanguages(){
    return this.http.get<Array<string>>(this.host + '/stats/languages/');
  }

  getLanguagesCount(){
    return this.http.get<LanguagesCount>(this.host + '/stats/languages/count/');
  }
}
