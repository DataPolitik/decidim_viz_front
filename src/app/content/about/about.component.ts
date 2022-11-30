import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SubMenuEntry } from 'src/app/models/sub_menu_entry.model';
import { SubMenuService } from 'src/app/services/sub_menu.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private subMenuService: SubMenuService) {
    this.subMenuService.setEntries([
        { label: 'submenu.about.goto', action: () => {window.location.href = "https://decidim.org/"}},
        { label: 'submenu.about.front', action: () => {window.location.href = "https://github.com/DataPolitik/decidim_viz_front"}},
        { label: 'submenu.about.back', action: () => {window.location.href = "https://github.com/DataPolitik/decidim_viz_back"}}
      ] as SubMenuEntry[]
    );
  }

  ngOnInit(): void {
  }

}
