import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StatsService } from '../services/stats.service';
import { ColorCommunities } from '../models/color_communities.model';
import { SubMenuService } from '../services/sub_menu.service';
import { SubMenuEntry } from '../models/sub_menu_entry.model';

@Component({
  selector: 'app-interactions',
  templateUrl: './interactions.component.html',
  styleUrls: ['./interactions.component.css']
})
export class InteractionsComponent implements OnInit, OnDestroy {
  private colorSubscription: Subscription | undefined;
  private commentsModularitySubscription: Subscription | undefined;
  private endorsementsModularitySubscription: Subscription | undefined;

  public modularityCommentsValue: number | undefined = undefined;
  public modularityEndorsementsValue: number | undefined = undefined;
  public commentsGraphType: string = "comments";
  public endorsementsGraphType: string = "endorsements";
  public currentElement = 'comments';
  public totalNodes: number = 0;
  public colorsNodes: { [id: string]: string[]; }[] = [];
  public colorsNodesSortedList: any[] = [];
  public communitiesProposals: any[] = [];
  public othersRatio: number = 0;


  constructor(private statsService: StatsService, private subMenuService: SubMenuService) {
    this.subMenuService.setEntries([
        { label: 'submenu.interactions.comments', action: () => {this.currentElement = "comments"; this.getCommunitiesNodes();}},
        { label: 'submenu.interactions.endorsements', action: () => {this.currentElement = "endorsements"; this.getCommunitiesNodes();}}
      ] as SubMenuEntry[]
    );
  }

  ngOnInit(): void {
    this.getCommunitiesNodes();
  }

  ngOnDestroy(): void {
    this.colorSubscription?.unsubscribe();
    this.commentsModularitySubscription?.unsubscribe();
    this.endorsementsModularitySubscription?.unsubscribe();
  }

  public isMinimumRatio(key: any): boolean {
    const ratio = this.getRatioOfCommunity(key);
    return ratio > 0.005;

  }

  private processResponse(response: ColorCommunities){
    this.totalNodes = response.total;
    this.colorsNodes = response.colors.users;
    this.communitiesProposals = response.colors.proposals;

    const listCommunities = [];
    for (let key in response.colors.users) {
      let value = response.colors.users[key];
      listCommunities.push(
        {
          'key': key, 'value': value, 'length':  Object.keys(value).length
        }
      )
    }
    let sortedAscendingCommunities = listCommunities.sort(function (first, second) {
      return second.length - first.length;
    });
    this.colorsNodesSortedList = sortedAscendingCommunities;
    this.othersRatio = this.computeOthersRatio();

  }


  private getCommunitiesNodes(): void {
    if (this.currentElement == 'comments'){
      this.colorSubscription = this.statsService.getCommentsColors().subscribe(
        (response: ColorCommunities) => {
          this.processResponse(response);
        }
      )
      this.commentsModularitySubscription = this.statsService.getCommentsModularityValue().subscribe(
        (response) => {
          this.modularityCommentsValue = response.modularity;
        }
      )
    }else{
      this.colorSubscription = this.statsService.getEndorsesColors().subscribe(
        (response: ColorCommunities) => {
          this.processResponse(response);
        }
      )
      this.endorsementsModularitySubscription = this.statsService.getEndorsementsModularityValue().subscribe(
        (response) => {
          this.modularityEndorsementsValue = response.modularity;
        }
      )
    }


  }

  /**
   * Share of users (0 to 1) in the communities too small to get their own
   * legend entry, i.e. those for which isMinimumRatio is false. Together with
   * the listed communities it adds up to 1.
   */
  public computeOthersRatio(): number {
    if (!this.totalNodes) {
      return 0;
    }
    const usersInOthers = this.colorsNodesSortedList
      .filter((community) => !this.isMinimumRatio(community.key))
      .reduce((sum, community) => sum + community.length, 0);
    return usersInOthers / this.totalNodes;
  }

  public getLenghtOfCommunity(key: any): number{
    return Number(this.colorsNodes[key]['length']);
  }

  public getRatioOfCommunity(key: any): number{
    return Number(this.colorsNodes[key]['length']) / this.totalNodes;
  }

  public getProposals(color: string): any[]{
    const communities = this.communitiesProposals[color as any];
    return communities;
  }
}
