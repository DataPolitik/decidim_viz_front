import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { StatsService } from '../services/stats.service';
import { ColorCommunities } from '../models/color_communities.model';
import { CONFIGS } from '../config/config.dev';
import { SubMenuService } from '../services/sub_menu.service';
import { SubMenuEntry } from '../models/sub_menu_entry.model';

@Component({
  selector: 'app-interactions',
  templateUrl: './interactions.component.html',
  styleUrls: ['./interactions.component.css']
})
export class InteractionsComponent implements OnInit, OnDestroy {
  private colorSubscription: Subscription | undefined;

  public commentsGraphType: string = "comments";
  public endorsementsGraphType: string = "endorsements";
  public currentElement = 'comments';
  public totalNodes: number = 0;
  public colorsNodes: { [id: string]: string[]; }[] = [];
  public communitiesProposals: any[] = [];


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
  }

  public isMinimumRatio(key: any): boolean {
    const ratio = this.getRatioOfCommunity(key);
    return ratio > 0.05;

  }


  private getCommunitiesNodes(): void {
    if (this.currentElement == 'comments'){
      this.colorSubscription = this.statsService.getCommentsColors().subscribe(
        (response: ColorCommunities) => {
          this.totalNodes = response.total;
          this.colorsNodes = response.colors.users;
          this.communitiesProposals = response.colors.proposals;
        }
      )
    }else{
      this.colorSubscription = this.statsService.getEndorsesColors().subscribe(
        (response: ColorCommunities) => {
          this.totalNodes = response.total;
          this.colorsNodes = response.colors.users;
          this.communitiesProposals = response.colors.proposals;
        }
      )
    }


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
