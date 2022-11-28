import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  public subMenuitems: MenuItem[] = [
    {label: 'Ir a Decidim.org',  command: e => this.takeAction(e, "decidim")},
    {label: 'Repositorio de GitHub (Front-end)',  command: e => this.takeAction(e, "front")},
    {label: 'Repositorio de GitHub (Back-end)',  command: e => this.takeAction(e, "back")}
  ];

  constructor() { }

  ngOnInit(): void {
  }

  private takeAction(e: any, section: string): void {
    if (section == 'decidim'){
      window.location.href = 'https://decidim.org/'
    }
    else if (section == 'front'){
      window.location.href = 'https://github.com/DataPolitik/decidim_viz_front'
    }
    else if (section == 'back'){
      window.location.href = 'https://github.com/DataPolitik/decidim_viz_back'
    }
  }

}
