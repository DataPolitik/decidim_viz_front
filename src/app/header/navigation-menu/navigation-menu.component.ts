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

  private buildMenuItems(stats: string, activities: string, interactions: string){
    this.menuItems = [
      {
        label: activities,
        icon: 'pi pi-fw pi-chart-pie',
        routerLink: ['/activities']
      },
      {
        label: stats,
        icon: 'pi pi-fw pi-users',
        routerLink: ['/stats']
      }
  ];
  }

  constructor(private translate_service: TranslateService) {
    let statsName = '';
    let activitiesName = '';
    let interactionsName = '';

    translate_service.get('menu.stats').subscribe((res: string) => {
      statsName = res;
      if(statsName.length > 0 && activitiesName.length > 0 && interactionsName.length > 0){
        this.buildMenuItems(statsName, activitiesName, interactionsName);
      }
    });

    translate_service.get('menu.activities').subscribe((res: string) => {
      activitiesName = res;
      if(statsName.length > 0 && activitiesName.length > 0 && interactionsName.length > 0){
        this.buildMenuItems(statsName, activitiesName, interactionsName);
      }
    });

    translate_service.get('menu.interactions').subscribe((res: string) => {
      interactionsName = res;
      if(statsName.length > 0 && activitiesName.length > 0 && interactionsName.length > 0){
        this.buildMenuItems(statsName, activitiesName, interactionsName);
      }
    });
  }

  ngOnInit(): void {

  }



}
