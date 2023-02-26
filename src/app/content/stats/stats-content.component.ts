import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';
import { BehaviorSubject, ignoreElements, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { LanguagesCount } from '../../models/languages.count.model';
import { StatsService } from '../../services/stats.service';

import { faLanguage } from '@fortawesome/free-solid-svg-icons';


import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api/menuitem';
import { SubMenuService } from 'src/app/services/sub_menu.service';
import { SubMenuEntry } from 'src/app/models/sub_menu_entry.model';
import { BoxDataModel } from 'src/app/models/box_data.model';
import { CommentsCountResponse } from 'src/app/models/comments_count_response.model';
import { ActiveInactiveUsersCountResponse } from 'src/app/models/active_inactive_users_count_response.model copy';

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
  public commentsStructureTreeMapOptions: AgChartOptions | undefined;
  public activeInactiveUsersTreeMapOptions: AgChartOptions | undefined;
  public commentsLengthData: Array<any> | undefined;
  public commentsDepth: Array<any> | undefined;
  public commentsPerUser: Array<any> | undefined;
  public timeToFirstComment: Array<any> | undefined;

  public faLanguage = faLanguage;
  public languages: Array<string> | undefined = undefined;
  public languageCount: Array<{name:string, size: number, color: number}> = [];
  public commentsTimesCount: Array<{name:string, size: number, color: number}> = [];
  public activeInactiveUsers: Array<{name:string, size: number, color: number}> = [];
  public categoryCommentCount: Array<{name:string, size: number, color: number}> = [];




  constructor(protected apollo: Apollo,
    protected ref: ChangeDetectorRef,
    protected statsService: StatsService,
    protected translate_service: TranslateService,
    private subMenuService: SubMenuService) {

      this.subMenuService.setEntries([
        { label: 'submenu.stats.comments', action: () => {document.getElementById("comments_section")?.scrollIntoView()}},
        { label: 'submenu.stats.proposals', action: () => {document.getElementById("proposals_section")?.scrollIntoView()}},
        { label: 'submenu.stats.users', action: () => {document.getElementById("users_section")?.scrollIntoView()}},
      ] as SubMenuEntry[]
    );
    }


  ngOnInit(): void {

    this.subs.add(this.statsService.getLanguages().subscribe(
      (languages_response) => {
        this.languages = languages_response;
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

    this.subs.add(
      this.statsService.getCommentsLength().subscribe(
        (response: BoxDataModel) => {
          this.commentsLengthData = response.box_data;
        }
      )
    );

    this.subs.add(
      this.statsService.getCommentsDepth().subscribe(
        (response: BoxDataModel) => {
          this.commentsDepth = response.box_data;
        }
      )
    );

    this.subs.add(
      this.statsService.getTimeToFirstResponse().subscribe(
        (response: BoxDataModel) => {
          this.timeToFirstComment = response.box_data;
        }
      )
    );

    this.subs.add(
      this.statsService.getProposalsCommentsCount().subscribe(
        (response: CommentsCountResponse) => {
          const zeroCounts = response[0];
          const commentsCount = response['>0'];
          this.commentsTimesCount?.push({
            name: 'No comments',
            size: zeroCounts,
            color: 2
          });
          this.commentsTimesCount?.push({
            name: 'Comments',
            size: commentsCount,
            color: 3
          });
          this.processCommentsTimeTreemap();
        }
      )
    );

    this.subs.add(
      this.statsService.getCommentsPerUser().subscribe(
        (response: BoxDataModel) => {
          this.commentsPerUser = response.box_data;
        }
      )
    );

    this.subs.add(
      this.statsService.getActiveInactiveUsers().subscribe(
        (response: ActiveInactiveUsersCountResponse) => {
          const inactiveCounts = response.inactive;
          const allCounts = response.all;
          const endorsementsCount = response.endorsements;
          const commentsCount = response.comments;
          // this.activeInactiveUsers?.push({
          //   name: 'Inactive',
          //   size: inactiveCounts,
          //   color: 3
          // });
          this.activeInactiveUsers?.push({
            name: 'Endorsements + comments',
            size: allCounts,
            color: 4
          });
          this.activeInactiveUsers?.push({
            name: 'Endorsements',
            size: endorsementsCount,
            color: 5
          });
          this.activeInactiveUsers?.push({
            name: 'Comments',
            size: commentsCount,
            color: 6
          });
          this.processCommentsActiveInactiveUsersTreemap();
        }
      )
    );


  }

  processLanguageTreemap() {
    this.languageTreeMapOptions = {
      data: this.languageCount,
      series: [
        {
          type: 'pie',
          angleKey: 'size',
          innerRadiusOffset: -70,
          sectorLabelKey: 'name',
          sectorLabel: {
              formatter: ({ datum, sectorLabelKey, angleKey }) => {
                  if(sectorLabelKey){
                    if(sectorLabelKey){
                      return datum[sectorLabelKey];
                    }
                  }else{
                    return '';
                  }
              }
          }
        },
      ],
      title: {
        text: '',
      },
    };
  }

  processCommentsTimeTreemap() {
    this.commentsStructureTreeMapOptions = {
      data: this.commentsTimesCount,
      series: [
        {
          type: 'pie',
          angleKey: 'size',
          innerRadiusOffset: -110,
          sectorLabelKey: 'name',
          sectorLabel:{
            formatter: ({ datum, sectorLabelKey, angleKey }) => {
              if(sectorLabelKey){
                return datum[sectorLabelKey];
              }
            }
          }
        },
      ],
      title: {
        text: '',
      },
    };
  }

  processCommentsActiveInactiveUsersTreemap() {
    this.activeInactiveUsersTreeMapOptions = {
      data: this.activeInactiveUsers,
      series: [
        {
          type: 'pie',
          angleKey: 'size',
          innerRadiusOffset: -110,
          sectorLabelKey: 'name',
          sectorLabel:{
            formatter: ({ datum, sectorLabelKey, angleKey }) => {
              if(sectorLabelKey){
                const name = datum[sectorLabelKey];
                if(name == "Endorsements + comments"){
                  return 'Both'
                }else{
                  return name;
                }
              }
            }
          }
        },
      ],
      title: {
        text: '',
      },
    };
  }


  ngOnDestroy(){  }

  private takeAction(e: any, section: string): void {
    if (section == 'languages'){
      document.getElementById("languages_section")?.scrollIntoView();
    }
  }

}
