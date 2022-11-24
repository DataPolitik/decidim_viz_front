import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-interactions',
  templateUrl: './interactions.component.html',
  styleUrls: ['./interactions.component.css']
})
export class InteractionsComponent implements OnInit {
  public commentsGraphType: string = "comments";
  public endorsementsGraphType: string = "endorsements";
  public currentElement = 'comments';

  public subMenuitems: MenuItem[] = [
    {label: 'Comentarios',  command: e => this.takeAction(e, "comments")},
    {label: 'Apoyos',  command: e => this.takeAction(e, "endorsements")}
  ];

  constructor() { }

  ngOnInit(): void {
  }

  private takeAction(e: any, section: string): void {
    this.currentElement = section;
  }

}
