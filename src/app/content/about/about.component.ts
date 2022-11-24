import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  public subMenuitems: MenuItem[] = [
    {label: 'Repositorio de GitHub',  command: e => this.takeAction(e, "github")}
  ];

  constructor() { }

  ngOnInit(): void {
  }

  private takeAction(e: any, section: string): void {
    if (section == 'github'){
      window.location.href = 'https://github.com/DataPolitik/decidim_viz_front'
    }
  }

}
