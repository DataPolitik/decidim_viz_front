import { Component, OnInit, OnDestroy  } from '@angular/core';
import { AgChartOptions, AgHierarchyChartOptions } from 'ag-charts-community';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { METRICS_COMMENTS, METRICS_PARTICIPATORY_PROCESSES, METRICS_PROPOSALS, METRICS_USERS } from '../graphql/graphql.queries';
import { Category, CategoryResponse } from '../models/category.model';
import { LanguagesCount } from '../models/languages.count.model';
import { Metrics } from '../models/metrics.model';
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


import { execute_metrics_query } from '../utils/metrics.utils';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, OnDestroy  {
  private subs = new Subscription();
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


  constructor(private apollo: Apollo, protected statsService: StatsService) {}

  user_loading: boolean = true;
  daily_proposal_loading: boolean = true;
  daily_comment_loading: boolean = true;
  participatory_processes_loading: boolean = true;

  user_metrics: Metrics | undefined;
  daily_proposal_metrics: Metrics | undefined;
  daily_comment_metrics: Metrics | undefined;
  participatory_processes_metrics: Metrics | undefined;
  comments_metrics: Metrics | undefined;

  categories: Array<Category> | undefined = undefined;
  categoriesByProposals: Array<Category> | undefined = undefined;
  categoriesByComments: Array<Category> | undefined = undefined;
  proposalsBySupports: Array<Proposal> | undefined = undefined;
  proposalsByComments: Array<Proposal> | undefined = undefined;
  languages: Array<string> | undefined = undefined;
  languageCount: Array<{name:string, size: number, color: number}> = [];
  categoryCommentCount: Array<{name:string, size: number, color: number}> = [];





  ngOnInit(): void {
    this.subs.add(execute_metrics_query(this.apollo, METRICS_USERS).subscribe(({ data, loading }) => {
      this.user_loading = false;
      this.user_metrics = data.metrics[0];
    }));

    this.subs.add(execute_metrics_query(this.apollo, METRICS_PROPOSALS).subscribe(({ data, loading }) => {
      this.daily_proposal_loading = false;
      this.daily_proposal_metrics = data.metrics[0];
      console.log(this.daily_proposal_metrics)
    }));

    this.subs.add(execute_metrics_query(this.apollo, METRICS_PARTICIPATORY_PROCESSES).subscribe(({ data, loading }) => {
      this.participatory_processes_loading = false;
      this.participatory_processes_metrics = data.metrics[0];
    }));

    this.subs.add( execute_metrics_query(this.apollo, METRICS_COMMENTS).subscribe(({ data, loading }) => {
      this.daily_comment_loading = false;
      this.comments_metrics = data.metrics[0];
    }));

    this.subs.add( this.statsService.getProposalsBySupports(15).subscribe((response: ProposalResponse) => {
      this.proposalsBySupports = response.proposals;
    }));

    this.subs.add( this.statsService.getProposalsByComments(15).subscribe((response: ProposalResponse) => {
      this.proposalsByComments = response.proposals;
    }));

    this.subs.add( this.statsService.getCategories().subscribe((response: CategoryResponse) => {
      this.categories = response.categories;
    }));

    this.subs.add( this.statsService.getCategoriesByComments().subscribe((response: CategoryResponse) => {
      this.categoriesByComments = response.categories;
    }));


    this.subs.add( this.statsService.getCategoriesByProposals(15).subscribe((response: CategoryResponse) => {
      this.categoriesByProposals = response.categories;
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
                content: `<b>Número de comentarios</b>: ${params.datum.datum.size}`,
              };
            },
          },
        },
      ],
      title: {
        text: 'Proporción de lenguajes utilizados en Futureu',
      }
    };
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}

