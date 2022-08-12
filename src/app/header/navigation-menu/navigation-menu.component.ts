import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.css']
})
export class NavigationMenuComponent implements OnInit {

  public menuItems!: MenuItem[];

  public type: string = 'endorsements';
  public graphTitle: string = '';
  public activeIndex = 0;

  private buildMenuItems(demography: string, metrics: string, interactions: string){
    this.menuItems = [
      {
        label: demography,
        icon: 'pi pi-fw pi-users',
        routerLink: ['/demografia']
      },
      {
        label: metrics,
        icon: 'pi pi-fw pi-chart-pie',
        routerLink: ['/metricas']
      },
      {
        label: interactions,
        icon: 'pi pi-fw pi-comments',
        routerLink: ['/interacciones']
      },
  ];
  }

  constructor(private translate_service: TranslateService) {
    let demographyName = '';
    let metricsName = '';
    let interactionsName = '';

    translate_service.get('menu.demography').subscribe((res: string) => {
      demographyName = res;
      if(demographyName.length > 0 && metricsName.length > 0 && interactionsName.length > 0){
        this.buildMenuItems(demographyName, metricsName, interactionsName);
      }
    });

    translate_service.get('menu.metrics').subscribe((res: string) => {
      metricsName = res;
      if(demographyName.length > 0 && metricsName.length > 0 && interactionsName.length > 0){
        this.buildMenuItems(demographyName, metricsName, interactionsName);
      }
    });

    translate_service.get('menu.interactions').subscribe((res: string) => {
      interactionsName = res;
      if(demographyName.length > 0 && metricsName.length > 0 && interactionsName.length > 0){
        this.buildMenuItems(demographyName, metricsName, interactionsName);
      }
    });
  }

  ngOnInit(): void {

  }



}
