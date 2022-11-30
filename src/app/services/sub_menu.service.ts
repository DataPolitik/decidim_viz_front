import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { SubMenuEntry } from '../models/sub_menu_entry.model';


@Injectable({
  providedIn: 'root'
})
export class SubMenuService {

  private entriesSubject = new BehaviorSubject<SubMenuEntry[]>([]);
  private entriesObservable = this.entriesSubject.asObservable();

  constructor() { }

  getEntries(): Observable<SubMenuEntry[]>{
    return this.entriesObservable;
  }

  setEntries(entries: SubMenuEntry[]): void{
    this.entriesSubject.next(entries);
  }
}
