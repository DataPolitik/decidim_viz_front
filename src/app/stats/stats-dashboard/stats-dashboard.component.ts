import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TranslateService } from '@ngx-translate/core';
import { AgChartOptions } from 'ag-charts-community';
import { Gini } from 'src/app/models/abstract_dash.model';

@Component({
  selector: 'app-stats-dashboard',
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.css']
})
export class StatsDashboardComponent<T> implements OnInit {
  public options: AgChartOptions | undefined;

  @Input() data: Array<T> | undefined = undefined;
  @Input() gini: Gini | undefined = undefined;
  @Input() gini_title: string = '';
  @Input() title: string = '';
  @Input() countColumnName: string  = '';
  @Input() titleColumn: string  = '';
  @Input() countColumn: string  = '';
  @Input() fillColor: string  = '';
  @Input() typeColumnCount: any  = 'number';
  @Input() isProposal: boolean = true;
  @Input() x_axis_title: string = '';
  @Input() y_axis_title: string = '';

  private translated_title: string = '';
  private translated_var_name: string = '';

  constructor(private router: Router, private translate: TranslateService) {
    this.toolTipRenderer = this.toolTipRenderer.bind(this);
    this.translate.stream('stats.axis_x_help').subscribe((res: string) => {
      this.translated_var_name = res;
    });
   }

  private toolTipRenderer(params: any){
    let contentText = 'Valor: ' + params.yValue.toFixed(0) + '.';
    let titleText = params.xValue;
    if(this.isProposal){
      contentText += ' ' + 'Click para más información';
      titleText = params.datum.title_es;
    }
    return {
      title: titleText,
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
               fill: this.fillColor,
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
          position: 'bottom',
          enabled: false
        },
        axes: [
          {
            type: 'number',
            position: 'left',
            title: {
              text: this.y_axis_title,
            },
            label: {
              format: ',.0f',
              fontSize: 10,
            },
          },
          {
            type: this.typeColumnCount,
            position: 'bottom',
            title: {
              text: this.x_axis_title,
            },
            label: {
              fontSize: 10,
            },
          },
        ],
    };
  }
}
