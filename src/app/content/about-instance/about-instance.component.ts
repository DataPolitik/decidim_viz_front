import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CONFIGS } from 'src/app/config/config.dev';
import { SubMenuEntry } from 'src/app/models/sub_menu_entry.model';
import { SubMenuService } from 'src/app/services/sub_menu.service';

@Component({
  selector: 'app-about-instance',
  templateUrl: './about-instance.component.html',
  styleUrls: ['./about-instance.component.css']
})
export class AboutInstanceComponent implements OnInit {

  constructor(private subMenuService: SubMenuService) {
      this.subMenuService.setEntries([
        { label: CONFIGS.instanceName, action: () => {window.location.href = "https://futureu.europa.eu/"}},
        { label: 'submenu.about_instance.download', action: () => {const server: string = CONFIGS.host + ':' + CONFIGS.port; window.location.href = server + '/stats/data/';}}
      ] as SubMenuEntry[]
    );
  }

  ngOnInit(): void {
  }

}
