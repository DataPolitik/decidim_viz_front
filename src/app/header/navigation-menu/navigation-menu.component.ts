import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { CONFIGS } from 'src/app/config/config.dev';

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

  private buildMenuItems(stats: string, activities: string, interactions: string, about: string){
    this.menuItems = [
      {
        label: activities,
        icon: 'pi pi-fw pi-chart-line',
        routerLink: ['/activities']
      },
      {
        label: interactions,
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['/interactions']
      },
      {
        label: stats,
        icon: 'pi pi-fw pi-chart-pie',
        routerLink: ['/stats']
      },
      {
        label: about,
        icon: 'pi pi-fw pi-question-circle',
        routerLink: ['/about']
      }
  ];
  }

  constructor(private translate_service: TranslateService) {  }

  ngOnInit(): void {
    let statsName = '';
    let activitiesName = '';
    let interactionsName = '';
    let aboutName = '';
    let instanceName = CONFIGS.instanceName;

    this.translate_service.stream('menu.stats').subscribe((res: string) => {
      statsName = res;
      if(statsName.length > 0 && activitiesName.length > 0 && interactionsName.length > 0){
        this.buildMenuItems(statsName, activitiesName, interactionsName, aboutName + instanceName);
      }
    });

    this.translate_service.stream('menu.activities').subscribe((res: string) => {
      activitiesName = res;
      if(statsName.length > 0 && activitiesName.length > 0 && interactionsName.length > 0){
        this.buildMenuItems(statsName, activitiesName, interactionsName, aboutName + instanceName);
      }
    });

    this.translate_service.stream('menu.interactions').subscribe((res: string) => {
      interactionsName = res;
      if(statsName.length > 0 && activitiesName.length > 0 && interactionsName.length > 0){
        this.buildMenuItems(statsName, activitiesName, interactionsName, aboutName + instanceName);
      }
    });

    this.translate_service.stream('menu.about').subscribe((res: string) => {
      aboutName = res;
      if(statsName.length > 0 && activitiesName.length > 0 && interactionsName.length > 0){
        this.buildMenuItems(statsName, activitiesName, interactionsName, aboutName + instanceName);
      }
    });
  }



}
