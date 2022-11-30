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

import { faLanguage } from '@fortawesome/free-solid-svg-icons';


import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api/menuitem';
import { SubMenuService } from 'src/app/services/sub_menu.service';
import { SubMenuEntry } from 'src/app/models/sub_menu_entry.model';

@Component({
  selector: 'app-content-stats-content',
  templateUrl: './stats-content.component.html',
  styleUrls: ['./stats-content.component.css']
})
export class StatsContentComponent implements OnInit, OnDestroy {


  private languageCountSubject = new BehaviorSubject<number>(0);
  private languageCountObservable = this.languageCountSubject.asObservable();

  protected subs = new Subscription();
  public languageTreeMapOptions: AgChartOptions | undefined;

  public faLanguage = faLanguage;
  private graphTitle: string = ''
  public languages: Array<string> | undefined = undefined;
  public languageCount: Array<{name:string, size: number, color: number}> = [];
  public categoryCommentCount: Array<{name:string, size: number, color: number}> = [];




  constructor(protected apollo: Apollo,
    protected ref: ChangeDetectorRef,
    protected statsService: StatsService,
    protected translate_service: TranslateService,
    private subMenuService: SubMenuService) {

      this.subMenuService.setEntries([
        { label: 'submenu.stats.languages', action: () => {}},
      ] as SubMenuEntry[]
    );
    }


  ngOnInit(): void {

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

  ngOnDestroy(){  }

  private takeAction(e: any, section: string): void {
    if (section == 'languages'){
      document.getElementById("languages_section")?.scrollIntoView();
    }
  }

}
