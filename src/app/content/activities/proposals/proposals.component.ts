import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapsComponent } from 'src/app/maps/maps.component';
import { Activities } from 'src/app/models/activities.model';
import { Proposal } from 'src/app/models/proposal.model';
import { AbstractActivitiesComponent } from '../abstract-activities/abstract-activities.component';

@Component({
  selector: 'app-activities-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent extends AbstractActivitiesComponent implements OnInit, OnDestroy {

  @ViewChild(MapsComponent) maps!: MapsComponent;

  public accumulated_proposal_activities: Activities | undefined;
  public daily_proposal_activities: Activities | undefined;
  public accumulated_proposal_loading: boolean = true;
  public numberOfGeographicalProposals: number = 0;

  private accumulatedSubscription: Subscription | undefined;
  private dailySubscription: Subscription | undefined;
  private proposalsSubscription: Subscription | undefined;

  daily_proposal_loading: boolean = true;

  override ngOnInit(): void {
    this.dateChanged();
    this.loadedGraphs = 0;

    if (this.dateFrom && this.dateTo){
      this.accumulatedSubscription = this.statsService.getAccumulatedNumberOfProposalsByRange(this.dateFromAsString, this.dateToAsString).subscribe(
        (response: Activities) => {
          this.accumulated_proposal_loading = false;
          this.accumulated_proposal_activities = response;
          this.loadedGraphs = this.loadedGraphs + 1;
          this.isEmpty = response.history.length == 0;
        }
      )

      this.dailySubscription = this.statsService.getDailyNumberOfProposalsByRange(this.dateFromAsString, this.dateToAsString ).subscribe(
        (response: Activities) => {
          this.daily_proposal_loading = false;
          this.daily_proposal_activities = response;
          this.loadedGraphs = this.loadedGraphs + 1;
          this.isEmpty = response.history.length == 0;
        }
      )

      this.proposalsSubscription = this.statsService.getProposalsByRange(this.dateFromAsString, this.dateToAsString).subscribe(
        (response: Array<Proposal>) => {
          response.forEach(
            (proposal: Proposal) => {
              if (proposal.latitude.length > 0 && proposal.longitude.length > 0){
                this.maps.addMarker(proposal);
                this.numberOfGeographicalProposals = this.numberOfGeographicalProposals + 1;
              }
            }
          )
        }
      )

    }
  }

  ngOnDestroy(): void {
    this.accumulatedSubscription?.unsubscribe();
    this.dailySubscription?.unsubscribe();
    this.proposalsSubscription?.unsubscribe();
    this.loadedGraphs = 0;
  }



}
