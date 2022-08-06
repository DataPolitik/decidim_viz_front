import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interactions',
  templateUrl: './interactions.component.html',
  styleUrls: ['./interactions.component.css']
})
export class InteractionsComponent implements OnInit {

  public commentsGraphTitle: string = "Comentarios";
  public endorsementsGraphTitle: string = "Apoyos";
  public commentsGraphType: string = "comments";
  public endorsementsGraphType: string = "endorsements";

  constructor() { }

  ngOnInit(): void {
  }

}
