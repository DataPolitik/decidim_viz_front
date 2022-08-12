import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Proposal } from 'src/app/models/proposal.model';

@Component({
  selector: 'app-proposals-viewer',
  templateUrl: './proposals-viewer.component.html',
  styleUrls: ['./proposals-viewer.component.css']
})
export class ProposalsViewerComponent implements OnInit {

  public proposal!: Proposal;

  constructor(private activatedRouteService:ActivatedRoute) {
    const id = this.activatedRouteService.snapshot.paramMap.get('id');
   }

  ngOnInit(): void {
    
  }

}
