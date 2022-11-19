import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgChartOptions, AgHierarchyChartOptions } from 'ag-charts-community';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TemporalLimitsAPI } from 'src/app/models/temporal-limits-api.model';
import { TemporalLimitsGraphHQL } from 'src/app/models/temporal-limits-graphql.model';
import { Apollo } from 'apollo-angular';
import { METRICS_COMMENTS, METRICS_PARTICIPATORY_PROCESSES, METRICS_PROPOSALS, METRICS_USERS } from '../../graphql/graphql.queries';
import { Category, CategoryResponse } from '../../models/category.model';
import { LanguagesCount } from '../../models/languages.count.model';
import { Activities } from '../../models/activities.model';
import { Proposal, ProposalResponse } from '../../models/proposal.model';
import { StatsService } from '../../services/stats.service';

import {
  faUsers,
  faLightbulb,
  faDiagramProject,
  faUsersBetweenLines,
  faLanguage,
  faHandsClapping,
  faComments,
  faLayerGroup } from '@fortawesome/free-solid-svg-icons';


import { execute_metrics_query } from '../../utils/metrics.utils';
import { TranslateService } from '@ngx-translate/core';
import { UsersByCommentsHistory, UsersByCommentsHistoryCommentInfo } from '../../models/activities_users_comments.model';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-content-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  private temporalLimitsAPISubscription:  Subscription |undefined = undefined;
  private temporalLimitsGraphHQLSubscription:  Subscription |undefined = undefined;

  private languageCountSubject = new BehaviorSubject<number>(0);
  private languageCountObservable = this.languageCountSubject.asObservable();

  protected subs = new Subscription();

  public dateFromLimit: Date | undefined = undefined;
  public dateToLimit: Date | undefined = undefined;
  public dateFrom: Date | undefined = undefined;
  public dateTo: Date | undefined = undefined;
  public temporalLimitsAPI: TemporalLimitsAPI | undefined;
  public temporalLimitsGraphHQL: TemporalLimitsGraphHQL | undefined;

  public dateFromAsString: string | undefined;
  public dateToAsString: string | undefined;

  public subMenuitems: MenuItem[] = [
    {label: 'Datos generales',  command: e => this.takeAction(e, "general")},
    {label: 'Dinámica temporal',  command: e => this.takeAction(e, "dynamics")} ,
    {label: 'Valores destacados',  command: e => this.takeAction(e, "featured")},
  ];

  public languageTreeMapOptions: AgChartOptions | undefined;
  public categoryCommentsTreeMapOptions: AgHierarchyChartOptions | undefined;

  public faUsers = faUsers;
  public faLightbulb = faLightbulb;
  public faDiagramProject = faDiagramProject;
  public faUsersBetweenLines = faUsersBetweenLines;
  public faLanguage = faLanguage;
  public faHandsClapping = faHandsClapping;
  public faComments = faComments;
  public faLayerGroup = faLayerGroup;

  private graphTitle: string = ''
  private graphContexText: string = ''


  public daily_user_loading: boolean = true;
  public daily_proposal_loading: boolean = true;
  public daily_comment_loading: boolean = true;
  public participatory_processes_loading: boolean = true;

  public daily_user_metrics: Activities | undefined;
  public daily_proposal_metrics: Activities | undefined;
  public daily_comment_metrics: Activities | undefined;
  public daily_participatory_processes_metrics: Activities | undefined;
  public comments_metrics: Activities | undefined;

  public categories: Array<Category> | undefined = undefined;
  public categoriesByProposalsGini: number | undefined = undefined;
  public categoriesByCommentsGini: number | undefined = undefined;
  public categoriesByProposals: Array<Category> | undefined = undefined;
  public categoriesByComments: Array<Category> | undefined = undefined;
  public proposalsBySupports: Array<Proposal> | undefined = undefined;
  public proposalsBySupportsGini: number | undefined = undefined;
  public proposalsByComments: Array<Proposal> | undefined = undefined;
  public proposalsByCommentsGini: number | undefined = undefined;
  public usersByComments: Array<UsersByCommentsHistoryCommentInfo> | undefined = undefined;
  public usersByCommentsGini: number | undefined = undefined;
  public languages: Array<string> | undefined = undefined;
  public languageCount: Array<{name:string, size: number, color: number}> = [];
  public categoryCommentCount: Array<{name:string, size: number, color: number}> = [];




  constructor(protected apollo: Apollo,
    protected ref: ChangeDetectorRef,
    protected statsService: StatsService,
    protected translate_service: TranslateService) {
      translate_service.get('stats.graph.title').subscribe((res: string) => {
      this.graphTitle = res;
      });
      translate_service.get('stats.graph.context_text').subscribe((res: string) => {
      this.graphContexText = res;
      });
  }

  private takeAction(e: any, section: string): void {
    if (section == 'dynamics'){
      document.getElementById("dynamics_section")?.scrollIntoView();
    }
    else if (section == 'general'){
      document.getElementById("general_stats_section")?.scrollIntoView();
    }
else{
      document.getElementById("featured_section")?.scrollIntoView();
    }
  }


  private updateLimitsDate(typeOfDates: string){
    if(typeOfDates == 'proposals'){
      if(this.temporalLimitsAPI){
        this.dateTo = new Date(this.temporalLimitsAPI?.proposals_to);
        this.dateToLimit = new Date(this.temporalLimitsAPI?.proposals_to);
        this.dateFromLimit = new Date(this.temporalLimitsAPI?.proposals_from);

        this.dateFrom  = new Date(this.temporalLimitsAPI?.proposals_to);
        this.dateFrom.setDate(this.dateFrom.getDate() - 90);
      }
    }
    else if(typeOfDates == 'comments'){
      if(this.temporalLimitsAPI){
        this.dateTo = new Date(this.temporalLimitsAPI?.comments_to);
        this.dateToLimit = new Date(this.temporalLimitsAPI?.comments_to);
        this.dateFromLimit = new Date(this.temporalLimitsAPI?.comments_from);

        this.dateFrom  = new Date(this.temporalLimitsAPI?.comments_from);
        this.dateFrom.setDate(this.dateFrom.getDate() - 90);
      }
    }
    else if(typeOfDates == 'processes'){
      if(this.temporalLimitsGraphHQL){
        this.dateTo = new Date(this.temporalLimitsGraphHQL?.participatory_processes_to);
        this.dateToLimit = new Date(this.temporalLimitsGraphHQL?.participatory_processes_to);
        this.dateFromLimit = new Date(this.temporalLimitsGraphHQL?.participatory_processes_from);

        this.dateFrom  = new Date(this.temporalLimitsGraphHQL?.participatory_processes_from);
      }
    }
    this.dateChanged();
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    this.subs.add(execute_metrics_query(this.apollo, METRICS_USERS).subscribe(({ data, loading }) => {
      this.daily_user_loading = false;
      this.daily_user_metrics = data.metrics[0];
    }));

    this.subs.add(execute_metrics_query(this.apollo, METRICS_PROPOSALS).subscribe(({ data, loading }) => {
      this.daily_proposal_loading = false;
      this.daily_proposal_metrics = data.metrics[0];
    }));

    this.subs.add(execute_metrics_query(this.apollo, METRICS_PARTICIPATORY_PROCESSES).subscribe(({ data, loading }) => {
      this.participatory_processes_loading = false;
      this.daily_participatory_processes_metrics = data.metrics[0];
    }));

    this.subs.add( execute_metrics_query(this.apollo, METRICS_COMMENTS).subscribe(({ data, loading }) => {
      this.daily_comment_loading = false;
      this.comments_metrics= data.metrics[0];
    }));

    this.subs.add( this.statsService.getUsersByComments(50).subscribe((response: UsersByCommentsHistory) => {
      this.usersByComments = response.comments;
      this.usersByCommentsGini = response.gini;
    }));

    this.subs.add( this.statsService.getProposalsBySupports(50).subscribe((response: ProposalResponse) => {
      for (let i = 0; i < response.proposals.length; ++i){
        response.proposals[i].position = i + 1;
      }
      this.proposalsBySupports = response.proposals;
      this.proposalsBySupportsGini = response.gini;
    }));

    this.subs.add( this.statsService.getProposalsByComments(50).subscribe((response: ProposalResponse) => {
      for (let i = 0; i < response.proposals.length; ++i){
        response.proposals[i].position = i + 1;
      }
      this.proposalsByComments = response.proposals;
      this.proposalsByCommentsGini = response.gini;
    }));

    this.subs.add( this.statsService.getCategories().subscribe((response: CategoryResponse) => {
      this.categories = response.categories;
    }));

    this.subs.add( this.statsService.getCategoriesByComments().subscribe((response: CategoryResponse) => {
      this.categoriesByComments = response.categories;
      this.categoriesByCommentsGini = response.gini;
    }));


    this.subs.add( this.statsService.getCategoriesByProposals(15).subscribe((response: CategoryResponse) => {
      this.categoriesByProposals = response.categories;
      this.categoriesByProposalsGini = response.gini;
    }));

    this.subs.add(this.statsService.getLanguages().subscribe(
      (languages_response) => {
        this.languages = languages_response;
        let counter = 0;
        this.subs.add(
          this.statsService.getLanguagesCount().subscribe(
            (response: LanguagesCount) => {
              response.languages.forEach(
                (language_detail) => {
                  this.languageCount?.push({
                    name: language_detail.language,
                    size: Number(language_detail.count),
                    color: 100*(Number(language_detail.count)/22519)
                  })
                }
              );
              this.processLanguageTreemap();
            }
          )
        )
      }
    ));

    this.subs.add(
      this.languageCountObservable.subscribe()
    );

    this.temporalLimitsAPISubscription = this.statsService.getTemporalLimitsAPI().subscribe(
      (temporaLimits: TemporalLimitsAPI | undefined) => {
        this.temporalLimitsAPI = temporaLimits;
        this.updateLimitsDate('proposals');
      }
    );
    this.temporalLimitsGraphHQLSubscription = this.statsService.getTemporalLimitsGraphHQL().subscribe(
      (temporalLimits: TemporalLimitsGraphHQL | undefined) => {
          this.temporalLimitsGraphHQL = temporalLimits;
      }
    );

  }

  processLanguageTreemap() {
    this.languageTreeMapOptions = {
      data: this.languageCount,
      series: [
        {
          type: 'pie',
          labelKey: 'name',
          angleKey: 'size',
          innerRadiusOffset: -70,
        },
      ],
      title: {
        text: this.graphTitle,
      }
    };
  }

  ngOnDestroy(){
    this.temporalLimitsAPISubscription?.unsubscribe();
  }


  public dateChanged(){
    if(this.dateFrom == undefined || this.dateTo  == undefined){
      return;
    }

    /// THIS IS A WORKAROUND FOR THIS BUG OF PRIME_NG
    /// https://github.com/primefaces/primeng/issues/2426
    const fixedDateFrom = new Date(this.dateFrom);
    const fixedDateTo = new Date(this.dateTo);

    fixedDateFrom.setDate(fixedDateFrom.getDate() + 1)
    fixedDateTo.setDate(fixedDateTo.getDate() + 1)

    //// TODO: REMOVE THIS WORKAROUND WHEN THE BUG GET FIXED


    this.dateFromAsString = fixedDateFrom.toISOString().split('T')[0];
    this.dateToAsString = fixedDateTo.toISOString().split('T')[0];
  }

  handleChange(event: any) {
    const index = event.index;

    switch(index){
      case 0:
        this.updateLimitsDate('proposals');
        break;
      case 1:
        this.updateLimitsDate('processes');
        break;
      case 2:
        this.updateLimitsDate('comments');
        break;
    }
}
}
