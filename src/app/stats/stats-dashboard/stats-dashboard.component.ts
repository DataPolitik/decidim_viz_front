import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TranslateService } from '@ngx-translate/core';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-stats-dashboard',
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.css']
})
export class StatsDashboardComponent<T> implements OnInit {
  public options: AgChartOptions | undefined;

  @Input() data: Array<T> | undefined = undefined;
  @Input() gini: number | undefined = undefined;
  @Input() title: string = '';
  @Input() countColumnName: string  = '';
  @Input() titleColumn: string  = '';
  @Input() countColumn: string  = '';
  @Input() icon: IconProp | undefined = undefined;
  @Input() isProposal: boolean = true;

  private translated_title: string = '';

  constructor(private router: Router, private translate: TranslateService) {
    this.toolTipRenderer = this.toolTipRenderer.bind(this);
   }

  private toolTipRenderer(params: any){
    let contentText = 'Valor: ' + params.yValue.toFixed(0) + '.';
    if(this.isProposal){
      contentText += ' ' + 'Click para más información';
    }
    return {
      title: params.xValue,
      content: contentText,
    };
  }

  ngOnInit(): void {
    this.translate.get(this.title).subscribe((text:string) => {this.translated_title = text});
    if(!this.data){
      return
    }
    this.options = {
        data: this.data,
        title: {
            text: this.translated_title,
        },
        series: [
            { type: 'column',
               xKey: this.titleColumn,
               yKey: this.countColumn,
               stacked: false,
               tooltip: {
                renderer: this.toolTipRenderer,
               },
               listeners: {
                nodeClick: (event) => {
                  if(!this.isProposal){
                    return;
                  }
                  const datum = event.datum;
                  this.router.navigate(['proposal/' + datum.id]);
                }
               }
            },
        ],
        legend: {
          position: 'bottom'
        }
    };
  }
}
