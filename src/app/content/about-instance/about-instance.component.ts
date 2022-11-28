import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CONFIGS } from 'src/app/config/config.dev';

@Component({
  selector: 'app-about-instance',
  templateUrl: './about-instance.component.html',
  styleUrls: ['./about-instance.component.css']
})
export class AboutInstanceComponent implements OnInit {

  public subMenuitems: MenuItem[] = [
    {label: 'Ir a ' + CONFIGS.instanceName,  command: e => this.takeAction(e, "go")},
    {label: 'Descarga de datos en bruto',  command: e => this.takeAction(e, "raw")}
  ];

  constructor() { }

  ngOnInit(): void {
  }

  private takeAction(e: any, section: string): void {
    if (section == 'go'){
      window.location.href = "https://futureu.europa.eu/";
    }
    else if (section == 'raw'){
      const server: string = CONFIGS.host + ':' + CONFIGS.port;
      window.location.href = server + '/stats/data/';
    }
  }

}
