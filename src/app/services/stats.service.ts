import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIGS } from '../config/config.dev';
import { CategoryResponse } from '../models/category.model';


import { GraphResponse } from '../models/graph_response.model';
import { Histogram } from '../models/histogram.model';
import { LanguagesCount } from '../models/languages.count.model';
import { Activities } from '../models/activities.model';
import { Proposal, ProposalResponse } from '../models/proposal.model';


@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private host = CONFIGS.host + ':' + CONFIGS.port;

  constructor(private http: HttpClient) { }

  getEndorses() {

    return this.http.get<GraphResponse>(this.host + '/stats/endorsements');
  }

  getUsersByProposal(idProposal: string | number){
    return this.http.get<Activities>(this.host + '/stats/users/by_proposal/'+idProposal+'/');
  }

  getComments() {
    return this.http.get<GraphResponse>(this.host + '/stats/comments');
  }

  getCommentsByProposal(idProposal: string | number) {
    return this.http.get<Activities>(this.host + '/stats/comments/by_proposal/'+idProposal+'/daily/');
  }

  getProposal(idProposal: string){
    return this.http.get<Proposal>(this.host + '/stats/proposal/' + idProposal);
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

  getMostCommentedProposal(){
    return this.http.get<Proposal>(this.host + '/stats/proposals/comments/first');
  }

  getMostEndorsedProposal(){
    return this.http.get<Proposal>(this.host + '/stats/proposals/endorses/first');
  }

  getDailyNumberOfProposalsByRange(date_from: string, date_to:string){
    return this.http.get<Activities>(this.host + '/stats/proposals/by_date/daily/'+date_from+'/'+date_to+'/');
  }

  getAccumulatedNumberOfProposalsByRange(date_from: string, date_to:string){
    return this.http.get<Activities>(this.host + '/stats/proposals/by_date/cumulative/'+date_from+'/'+date_to+'/');
  }


  getProposalsByRange(date_from: string, date_to:string){
    return this.http.get<Array<Proposal>>(this.host + '/stats/proposals/by_date/'+date_from+'/'+date_to+'/');
  }

  getDailyNumberOfCommentsByRange(date_from: string, date_to:string){
    return this.http.get<Activities>(this.host + '/stats/comments/by_date/daily/'+date_from+'/'+date_to+'/');
  }

  getAccumulatedNumberOfCommentsByRange(date_from: string, date_to:string){
    return this.http.get<Activities>(this.host + '/stats/comments/by_date/cumulative/'+date_from+'/'+date_to+'/');
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
