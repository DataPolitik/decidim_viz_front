import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-boxplot',
  templateUrl: './boxplot.component.html',
  styleUrls: ['./boxplot.component.css']
})
export class BoxplotComponent implements OnInit {

  @Input() dataInput: Array<any> | undefined;
  @Input() title: string | undefined;
  @Input() height: number | undefined;
  @Input() width: number | undefined;

  layout: any;
  public data: any | undefined = undefined

  constructor() { }

  ngOnInit(): void {
    if(this.title){
      this.layout = {
        title: {
          text: this.title,
          size: '70px'
        },
        height: this.height,
        width: this.width,
        yaxis: {
          showticklabels: false
        }
      };
    }
    this.data = [{
      y: this.dataInput,
      type: 'box',
      name: '',
      boxpoints: false
    }]
   }


}
