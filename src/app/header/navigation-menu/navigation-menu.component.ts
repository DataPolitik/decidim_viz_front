import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.css']
})
export class NavigationMenuComponent implements OnInit {

  public menuItems: MenuItem[];

  public type: string = 'endorsements';
  public graphTitle: string = '';
  public activeIndex = 0;

  constructor() {
    this.menuItems = [
      {
        label: 'Demografía',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/demografia']
      },
      {
        label: 'Interacciones',
        icon: 'pi pi-fw pi-calendar',
        routerLink: ['/interacciones']
      },
  ];
  }

  ngOnInit(): void {

  }



}
