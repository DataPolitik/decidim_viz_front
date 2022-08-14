import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Metrics } from 'src/app/models/metrics.model';
import { Proposal } from 'src/app/models/proposal.model';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-proposals-viewer',
  templateUrl: './proposals-viewer.component.html',
  styleUrls: ['./proposals-viewer.component.css']
})
export class ProposalsViewerComponent implements OnInit, OnDestroy {

  public proposal: Proposal | undefined;
  public isFound : boolean | undefined = undefined;
  public comments_histogram: Metrics | undefined;
  public users_histogram: Metrics | undefined;

  private id: string | null;
  private proposalSubscription!: Subscription;
  private histogramSubscription!: Subscription;
  private usersSubscription!: Subscription;

  constructor(private activatedRouteService:ActivatedRoute,
              private stats: StatsService) {
    this.id = this.activatedRouteService.snapshot.paramMap.get('id');
   }

   private getCommentsHistogram(){
    if (this.id){
      this.histogramSubscription = this.stats.getCommentsByProposal(this.id).subscribe(
        (response) => {
          this.comments_histogram = response;
        }
      )
    }
   }

   private getUsersByProposal(){
    if (this.id){
      this.usersSubscription = this.stats.getUsersByProposal(this.id).subscribe(
        (response) => {
          this.users_histogram = response;
        }
      )
    }
   }

  ngOnInit(): void {
    if (this.id){
        this.proposalSubscription = this.stats.getProposal(this.id).subscribe({
          next : response => {
            this.proposal = response;
            this.isFound = true;
            this.getCommentsHistogram();
            this.getUsersByProposal();
          },
          error : () => {
            this.isFound = false;
          }
        }
      )
    }
  }

  ngOnDestroy(): void {
    this.proposalSubscription?.unsubscribe();
    this.histogramSubscription?.unsubscribe();
    this.usersSubscription?.unsubscribe();
  }

}
