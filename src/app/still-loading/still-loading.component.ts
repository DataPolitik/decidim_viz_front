import { Component, OnInit } from '@angular/core';

import { faTruckRampBox } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-still-loading',
  templateUrl: './still-loading.component.html',
  styleUrls: ['./still-loading.component.css']
})
export class StillLoadingComponent implements OnInit {

  public faTruckRampBox = faTruckRampBox;

  constructor() { }

  ngOnInit(): void {
  }

}
