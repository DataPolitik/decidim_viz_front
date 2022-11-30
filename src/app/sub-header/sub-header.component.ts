import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SubMenuEntry } from '../models/sub_menu_entry.model';
import { SubMenuService } from '../services/sub_menu.service';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.css']
})
export class SubHeaderComponent implements OnInit, OnDestroy {
  private entriesSubscription: Subscription | undefined = undefined;

  @Input() entries: SubMenuEntry[] = [];


  constructor(private subMenuService: SubMenuService) { }

  ngOnInit(): void {
    this.entriesSubscription = this.subMenuService.getEntries().subscribe(
      (newEntries: SubMenuEntry[]) => {
        this.entries = newEntries;
      }
    )
  }

  ngOnDestroy(): void {
    this.entriesSubscription?.unsubscribe();
  }

  public executeAction(item: SubMenuEntry): void {
    item.action();
  }

}
