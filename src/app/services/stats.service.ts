import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIGS } from '../config/config.dev';
import { CategoryResponse } from '../models/category.model';


import { GraphResponse } from '../models/graph_response.model';
import { Histogram } from '../models/histogram.model';
import { LanguagesCount } from '../models/languages.count.model';
import { Activities } from '../models/activities.model';
import { Proposal, ProposalResponse } from '../models/proposal.model';
import { BehaviorSubject } from 'rxjs';
import { TemporalLimitsAPI as TemporalLimitsAPI } from '../models/temporal-limits-api.model';
import { Observable } from 'rxjs';
import { TemporalLimitsGraphHQL } from '../models/temporal-limits-graphql.model';
import { UsersByCommentsHistory } from '../models/activities_users_comments.model';
import { ColorCommunities } from '../models/color_communities.model';
import { BoxDataModel } from '../models/box_data.model';
import { CommentsCountResponse } from '../models/comments_count_response.model';
import { ActiveInactiveUsersCountResponse } from '../models/active_inactive_users_count_response.model copy';


@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private host = CONFIGS.host + ':' + CONFIGS.port;

  constructor(private http: HttpClient) { }

  private temporalLimitsAPISubjects = new BehaviorSubject<TemporalLimitsAPI | undefined>(undefined);
  private temporalLimitsAPIObservable = this.temporalLimitsAPISubjects.asObservable();

  private temporalLimitsGraphHQLSubjects = new BehaviorSubject<TemporalLimitsGraphHQL | undefined>(undefined);
  private temporalLimitsGraphHQLSObservable = this.temporalLimitsGraphHQLSubjects.asObservable();

  getTemporalLimitsAPI(): Observable<TemporalLimitsAPI | undefined>{
    return this.temporalLimitsAPIObservable;
  }

  getTemporalLimitsGraphHQL(): Observable<TemporalLimitsGraphHQL | undefined>{
    return this.temporalLimitsGraphHQLSObservable;
  }

  subscribeTemporalLimitsAPI(){
    return this.http.get<TemporalLimitsAPI>(this.host + '/stats/dates').subscribe(
      (temporaLimits: TemporalLimitsAPI) => {
        this.temporalLimitsAPISubjects.next(temporaLimits);
      }
    )
  }

  setTemporalLimitsGraphHQL(temporalLimits: TemporalLimitsGraphHQL){
    this.temporalLimitsGraphHQLSubjects.next(temporalLimits);
  }

  getEndorses() {
    return this.http.get(this.host + '/stats/endorsements',{responseType: 'text'});
  }

  getEndorsesColors(): Observable<ColorCommunities> {
    return this.http.get<ColorCommunities>(this.host + '/stats/endorsements/colors');
  }

  getCommentsColors(): Observable<ColorCommunities> {
    return this.http.get<ColorCommunities>(this.host + '/stats/comments/colors');
  }

  getUsersByProposal(idProposal: string | number){
    return this.http.get<Activities>(this.host + '/stats/users/by_proposal/'+idProposal+'/');
  }

  getActiveInactiveUsers(){
    return this.http.get<ActiveInactiveUsersCountResponse>(this.host + '/stats/users/active_proportion');
  }

  getCommentsLength(){
    return this.http.get<BoxDataModel>(this.host + '/stats/comments/length');
  }

  getComments() {
    return this.http.get<GraphResponse>(this.host + '/stats/comments');
  }

  getCommentsByProposal(idProposal: string | number) {
    return this.http.get<Activities>(this.host + '/stats/comments/by_proposal/'+idProposal+'/daily/');
  }

  getCommentsDepth(){
    return this.http.get<BoxDataModel>(this.host + '/stats/comments/depth');
  }

  getUsersByComments(limit: number) {
    return this.http.get<UsersByCommentsHistory>(this.host + '/stats/users/by_comments/'+limit);
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

  getCommentsPerUser() {
    return this.http.get<BoxDataModel>(this.host + '/stats/comments/per_user');
  }

  getProposalsBySupports(limit: number){
    return this.http.get<ProposalResponse>(this.host + '/stats/proposals/supports/'+limit);
  }

  getProposalsByComments(limit: number){
    return this.http.get<ProposalResponse>(this.host + '/stats/proposals/comments/'+limit);
  }

  getProposalsCommentsCount(){
    return this.http.get<CommentsCountResponse>(this.host + '/stats/proposals/responses/comments/count');
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

  getCommentsModularityValue(){
    return this.http.get<{modularity: number}>(this.host + '/stats/comments/modularity');
  }

  getEndorsementsModularityValue(){
    return this.http.get<{modularity: number}>(this.host + '/stats/endorsements/modularity');
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

  getTimeToFirstResponse(){
    return this.http.get<BoxDataModel>(this.host + '/stats/proposals/responses/first/time/');
  }

  getLanguagesCount(){
    return this.http.get<LanguagesCount>(this.host + '/stats/languages/count/');
  }
}
