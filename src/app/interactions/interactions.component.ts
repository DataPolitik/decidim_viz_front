import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { StatsService } from '../services/stats.service';
import { ColorCommunities } from '../models/color_communities.model';
import { CONFIGS } from '../config/config.dev';

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

  public subMenuitems: MenuItem[] = [
    {label: 'Comentarios',  command: e => this.takeAction(e, "comments")},
    {label: 'Apoyos',  command: e => this.takeAction(e, "endorsements")}
  ];

  constructor(private statsService: StatsService) { }

  ngOnInit(): void {
    this.getCommunitiesNodes();
  }

  ngOnDestroy(): void {
    this.colorSubscription?.unsubscribe();
  }

  private takeAction(e: any, section: string): void {
    this.currentElement = section;
    this.getCommunitiesNodes();
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
