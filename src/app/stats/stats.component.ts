import { Component, OnInit, OnDestroy  } from '@angular/core';
import { AgChartOptions, AgHierarchyChartOptions } from 'ag-charts-community';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ACTIVITIES_COMMENTS, ACTIVITIES_PARTICIPATORY_PROCESSES, ACTIVITIES_PROPOSALS, ACTIVITIES_USERS } from '../graphql/graphql.queries';
import { Category, CategoryResponse } from '../models/category.model';
import { LanguagesCount } from '../models/languages.count.model';
import { Activities } from '../models/activities.model';
import { Proposal, ProposalResponse } from '../models/proposal.model';
import { StatsService } from '../services/stats.service';
import {
  faUsers,
  faLightbulb,
  faDiagramProject,
  faUsersBetweenLines,
  faLanguage,
  faHandsClapping,
  faComments,
  faLayerGroup } from '@fortawesome/free-solid-svg-icons';


import { execute_activities_query } from '../utils/activities.utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, OnDestroy  {
  protected subs = new Subscription();
  private languageCountSubject = new BehaviorSubject<number>(0);
  private languageCountObservable = this.languageCountSubject.asObservable();

  public languageTreeMapOptions: AgHierarchyChartOptions | undefined;
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

  constructor(protected apollo: Apollo,
              protected statsService: StatsService,
              protected translate_service: TranslateService) {
    translate_service.get('stats.graph.title').subscribe((res: string) => {
      this.graphTitle = res;
    });
    translate_service.get('stats.graph.context_text').subscribe((res: string) => {
      this.graphContexText = res;
    });
  }

  daily_user_loading: boolean = true;
  daily_proposal_loading: boolean = true;
  daily_comment_loading: boolean = true;
  participatory_processes_loading: boolean = true;

  daily_user_activities: Activities | undefined;
  daily_proposal_activities: Activities | undefined;
  daily_comment_activities: Activities | undefined;
  daily_participatory_processes_activities: Activities | undefined;
  comments_activities: Activities | undefined;

  categories: Array<Category> | undefined = undefined;
  categoriesGini: number | undefined = undefined;
  categoriesByProposals: Array<Category> | undefined = undefined;
  categoriesByComments: Array<Category> | undefined = undefined;
  proposalsBySupports: Array<Proposal> | undefined = undefined;
  proposalsBySupportsGini: number | undefined = undefined;
  proposalsByComments: Array<Proposal> | undefined = undefined;
  proposalsByCommentsGini: number | undefined = undefined;
  languages: Array<string> | undefined = undefined;
  languageCount: Array<{name:string, size: number, color: number}> = [];
  categoryCommentCount: Array<{name:string, size: number, color: number}> = [];


  ngOnInit(): void {
    this.subs.add(execute_activities_query(this.apollo, ACTIVITIES_USERS).subscribe(({ data, loading }) => {
      this.daily_user_loading = false;
      this.daily_user_activities = data.activities[0];
    }));

    this.subs.add(execute_activities_query(this.apollo, ACTIVITIES_PROPOSALS).subscribe(({ data, loading }) => {
      this.daily_proposal_loading = false;
      this.daily_proposal_activities = data.activities[0];
    }));

    this.subs.add(execute_activities_query(this.apollo, ACTIVITIES_PARTICIPATORY_PROCESSES).subscribe(({ data, loading }) => {
      this.participatory_processes_loading = false;
      this.daily_participatory_processes_activities = data.activities[0];
    }));

    this.subs.add( execute_activities_query(this.apollo, ACTIVITIES_COMMENTS).subscribe(({ data, loading }) => {
      this.daily_comment_loading = false;
      this.comments_activities = data.activities[0];
    }));

    this.subs.add( this.statsService.getProposalsBySupports(15).subscribe((response: ProposalResponse) => {
      this.proposalsBySupports = response.proposals;
      this.proposalsBySupportsGini = response.gini;
    }));

    this.subs.add( this.statsService.getProposalsByComments(15).subscribe((response: ProposalResponse) => {
      this.proposalsByComments = response.proposals;
      this.proposalsByCommentsGini = response.gini;
    }));

    this.subs.add( this.statsService.getCategories().subscribe((response: CategoryResponse) => {
      this.categories = response.categories;
    }));

    this.subs.add( this.statsService.getCategoriesByComments().subscribe((response: CategoryResponse) => {
      this.categoriesByComments = response.categories;
    }));


    this.subs.add( this.statsService.getCategoriesByProposals(15).subscribe((response: CategoryResponse) => {
      this.categoriesByProposals = response.categories;
      this.categoriesGini = response.gini;
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
  }



  processLanguageTreemap() {
    const languageTreeMapData = {
      name: 'Root',
      children: this.languageCount
    }
    this.languageTreeMapOptions = {
      type: 'hierarchy',
      data: languageTreeMapData,
      series: [
        {
          type: 'treemap',
          labelKey: 'name',
          sizeKey: 'size',
          colorKey: undefined,
          labels: {
            small:{
              enabled: true,
              fontSize: 10,
            },
            medium:{
              enabled: true,
              fontSize: 10,
            },
            large:{
              enabled: true,
              fontSize: 30,
            }
          },
          tooltip: {
            renderer: (params) => {
              return {
                content: `<b>`+this.graphContexText+`</b>: ${params.datum.datum.size}`,
              };
            },
          },
        },
      ],
      title: {
        text: this.graphTitle,
      }
    };
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}

