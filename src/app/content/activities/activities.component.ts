import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgChartOptions, AgHierarchyChartOptions } from 'ag-charts-community';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TemporalLimitsAPI } from 'src/app/models/temporal-limits-api.model';
import { TemporalLimitsGraphHQL } from 'src/app/models/temporal-limits-graphql.model';
import { Apollo } from 'apollo-angular';
import { PARTICIPATORY_PROCESSES_TOTAL } from '../../graphql/graphql.queries';
import { Summary } from '../../models/summary.model';
import { withUniqueLabels } from '../../utils/person-labels';
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
import { AbstractDash, Gini } from 'src/app/models/abstract_dash.model';
import { SubMenuEntry } from 'src/app/models/sub_menu_entry.model';
import { SubMenuService } from 'src/app/services/sub_menu.service';

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


  // Headline counts; a failed request shows "not available" instead of loading forever.
  public summary: Summary | undefined;
  public summaryFailed = false;
  public participatoryProcessesCount: number | undefined;
  public participatoryProcessesFailed = false;

  public categories: Array<Category> | undefined = undefined;
  public categoriesByProposalsGini: Gini | undefined = undefined;
  public categoriesByCommentsGini: Gini | undefined = undefined;
  public proposalsBySupportsGini: Gini | undefined = undefined;
  public proposalsByCommentsGini: Gini | undefined = undefined;
  public usersByCommentsGini: Gini | undefined = undefined;
  public categoriesByProposals: Array<Category> | undefined = undefined;
  public categoriesByComments: Array<Category> | undefined = undefined;
  public proposalsBySupports: Array<Proposal> | undefined = undefined;
  public proposalsByComments: Array<Proposal> | undefined = undefined;
  public usersByComments: Array<UsersByCommentsHistoryCommentInfo> | undefined = undefined;
  public languages: Array<string> | undefined = undefined;
  public languageCount: Array<{name:string, size: number, color: number}> = [];
  public categoryCommentCount: Array<{name:string, size: number, color: number}> = [];




  constructor(
        protected apollo: Apollo,
        protected ref: ChangeDetectorRef,
        protected statsService: StatsService,
        protected translate_service: TranslateService,
        private subMenuService: SubMenuService) {
          translate_service.get('stats.graph.title').subscribe((res: string) => {
          this.graphTitle = res;
          });
          translate_service.get('stats.graph.context_text').subscribe((res: string) => {
          this.graphContexText = res;
          });


          this.subMenuService.setEntries([
              { label: 'submenu.activities.general_data', action: () => {document.getElementById("general_stats_section")?.scrollIntoView()}},
              { label: 'submenu.activities.dynamics', action: () => {document.getElementById("dynamics_section")?.scrollIntoView()}},
              { label: 'submenu.activities.featured', action: () => {document.getElementById("featured_section")?.scrollIntoView()}},
            ] as SubMenuEntry[]
          );
  }


  private updateLimitsDate(typeOfDates: string){
    if(typeOfDates == 'proposals'){
      if(this.temporalLimitsAPI){
        this.dateTo = new Date(this.temporalLimitsAPI?.proposals_to);
        this.dateToLimit = new Date(this.temporalLimitsAPI?.proposals_to);
        this.dateFromLimit = new Date(this.temporalLimitsAPI?.proposals_from);

        // By default the whole period with data is shown.
        this.dateFrom  = new Date(this.temporalLimitsAPI?.proposals_from);
      }
    }
    else if(typeOfDates == 'comments'){
      if(this.temporalLimitsAPI){
        this.dateTo = new Date(this.temporalLimitsAPI?.comments_to);
        this.dateToLimit = new Date(this.temporalLimitsAPI?.comments_to);
        this.dateFromLimit = new Date(this.temporalLimitsAPI?.comments_from);

        this.dateFrom  = new Date(this.temporalLimitsAPI?.comments_from);
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
    // Participants, proposals and comments come from the imported data, like the rest of the page.
    this.subs.add(this.statsService.getSummary().subscribe({
      next: (summary: Summary) => this.summary = summary,
      error: () => this.summaryFailed = true,
    }));

    // Participatory processes are not in the imported data: ask the Decidim instance.
    // Apollo reports some failures as an error and others as a result without data.
    this.subs.add(execute_metrics_query(this.apollo, PARTICIPATORY_PROCESSES_TOTAL).subscribe({
      next: ({ data, loading }) => {
        if (loading) {
          return;
        }
        this.participatoryProcessesCount = data?.participatoryProcesses?.length;
        this.participatoryProcessesFailed = this.participatoryProcessesCount === undefined;
      },
      error: () => this.participatoryProcessesFailed = true,
    }));

    this.subs.add( this.statsService.getUsersByComments(50).subscribe((response: UsersByCommentsHistory) => {
      // Each bar needs its own label: unnamed people and namesakes would otherwise share one bar.
      this.subs.add(this.translate_service.get('stats.unnamed_participant').subscribe((unnamed: string) => {
        this.usersByCommentsGini = response.gini;
        // Bars are numbered by rank, like the proposal charts; the name shows on hover.
        this.usersByComments = withUniqueLabels(response.comments, unnamed)
          .map((person, i) => ({ ...person, position: i + 1 }));
      }));
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
