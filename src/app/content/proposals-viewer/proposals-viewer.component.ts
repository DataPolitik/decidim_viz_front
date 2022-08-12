import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  private id: string | null;
  private subscription!: Subscription;

  constructor(private activatedRouteService:ActivatedRoute,
              private stats: StatsService) {
    this.id = this.activatedRouteService.snapshot.paramMap.get('id');
   }


  ngOnInit(): void {
    if (this.id){
        this.subscription = this.stats.getProposal(this.id).subscribe({
          next : response => {
            this.proposal = response;
            this.isFound = true;
          },
          error : () => {
            this.isFound = false;
          }
        }
      )
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
