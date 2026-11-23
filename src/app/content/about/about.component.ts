import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InstanceInfo } from 'src/app/models/instance.model';
import { StatsService } from 'src/app/services/stats.service';
import { SubMenuEntry } from 'src/app/models/sub_menu_entry.model';
import { SubMenuService } from 'src/app/services/sub_menu.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  /** The instance the data come from, as reported by the back end. */
  public instance: InstanceInfo | undefined;
  private instanceSubscription: Subscription | undefined;

  constructor(private subMenuService: SubMenuService, private stats: StatsService) {
    this.subMenuService.setEntries([
        { label: 'submenu.about.front', action: () => {window.location.href = "https://github.com/DataPolitik/decidim_viz_front"}},
        { label: 'submenu.about.back', action: () => {window.location.href = "https://github.com/DataPolitik/decidim_viz_back"}}
      ] as SubMenuEntry[]
    );
  }

  ngOnInit(): void {
    this.instanceSubscription = this.stats.getInstance().subscribe(instance => this.instance = instance);
  }

  ngOnDestroy(): void {
    this.instanceSubscription?.unsubscribe();
  }

}
