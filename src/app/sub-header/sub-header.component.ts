import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SubMenuEntry } from '../models/sub_menu_entry.model';
import { SubMenuService } from '../services/sub_menu.service';
import { StatsService } from '../services/stats.service';
import { InstanceInfo } from '../models/instance.model';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.css']
})
export class SubHeaderComponent implements OnInit, OnDestroy {
  private entriesSubscription: Subscription | undefined = undefined;
  private instanceSubscription: Subscription | undefined = undefined;
  public instance: InstanceInfo | undefined;

  @Input() entries: SubMenuEntry[] = [];


  constructor(private subMenuService: SubMenuService, private stats: StatsService) { }

  ngOnInit(): void {
    this.entriesSubscription = this.subMenuService.getEntries().subscribe(
      (newEntries: SubMenuEntry[]) => {
        this.entries = newEntries;
      }
    )
    this.instanceSubscription = this.stats.getInstance().subscribe(instance => this.instance = instance);
  }

  ngOnDestroy(): void {
    this.entriesSubscription?.unsubscribe();
    this.instanceSubscription?.unsubscribe();
  }

  public executeAction(item: SubMenuEntry): void {
    item.action();
  }

}
