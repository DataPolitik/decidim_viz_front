import { Component, ElementRef, HostListener, Input, OnChanges, ViewChild } from '@angular/core';
import { AgChartsAngular } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { Activities_History } from 'src/app/models/activities_history.model';
import { ProcessPeriod } from 'src/app/models/process_period.model';
import { capitalizeFirst } from 'src/app/utils/capitalize';

const START_COLOR = '#2e7d32';
const END_COLOR = '#c62828';
/** A process line: which process, whether it marks its start or end, and where its hover strip goes. */
interface ProcessLine {
  date: Date,
  kind: 'start' | 'end',
  title: string,
  /** The line's date as dd/mm/yyyy, for its tooltip ("…: started on …" / "…: ended on …"). */
  day: string,
  left?: number,
  top?: number,
  height?: number,
}

@Component({
  selector: 'app-activities-histogram',
  templateUrl: './activities-histograms.component.html',
  styleUrls: ['./activities-histograms.component.css']
})
export class ActivitiesHistogramComponent implements OnChanges {

  @Input() title: string = "";
  @Input() xName: string = "";
  @Input() yName: string = "";
  @Input() response: Array<Activities_History> | undefined;
  /** Processes whose start (solid line) and end (dashed line) fall in the chart are marked. */
  @Input() processes: ProcessPeriod[] = [];
  /** Running totals: a day without data keeps the previous value instead of 0. */
  @Input() cumulative = false;

  public options: AgChartOptions | undefined = undefined;
  /** The process lines in the chart; each gets a hoverable strip with its tooltip. */
  public processLines: ProcessLine[] = [];

  @ViewChild(AgChartsAngular) private agChart?: AgChartsAngular;

  constructor(private element: ElementRef<HTMLElement>) {}

  /** What the chart was last built from (see ngOnChanges). */
  private builtFrom = '';

  ngOnChanges(): void {
    // The pages pass `history.slice().reverse()`, a new array at every change
    // detection: rebuild only when the data or the processes really changed,
    // or placing the strips (which triggers change detection) would loop.
    const response = this.response ?? [];
    const signature = JSON.stringify([response.length, response[0], response[response.length - 1],
      this.cumulative, this.processes.map(p => [p.title, p.start?.getTime(), p.end?.getTime()])]);
    if (signature === this.builtFrom) {
      return;
    }
    this.builtFrom = signature;

    const data = fillMissingDays((this.response ?? [])
      .map(entry => ({ date: parseKey(entry.key), value: Number(entry.value) }))
      .filter((entry): entry is { date: Date, value: number } => entry.date !== null)
      .sort((a, b) => a.date.getTime() - b.date.getTime()), this.cumulative);
    const first = data[0]?.date, last = data[data.length - 1]?.date;
    const inRange = (date: Date | null) => !!date && !!first && !!last && date >= first && date <= last;

    // The chart draws the lines (cross lines can't show tooltips); thin HTML
    // strips laid over them once the chart is drawn carry the tooltips.
    const crossLines: any[] = [];
    this.processLines = [];
    for (const process of this.processes) {
      for (const [date, kind] of [[process.start, 'start'], [process.end, 'end']] as Array<[Date | null, 'start' | 'end']>) {
        if (!inRange(date)) {
          continue;
        }
        crossLines.push(kind === 'start'
          ? { type: 'line', value: date, stroke: START_COLOR, strokeWidth: 1 }
          : { type: 'line', value: date, stroke: END_COLOR, strokeWidth: 1, lineDash: [4, 3] });
        this.processLines.push({ date: date!, kind, title: process.title, day: date!.toLocaleDateString('en-GB') });
      }
    }
    this.placeProcessLines();

    this.options = {
      autoSize: true,
      title: {
        text: this.title,
      },
      data,
      series: [
        {
          type: 'line',
          xKey: 'date',
          xName: this.xName,
          yKey: 'value',
          yName: this.yName,
          marker: { size: 3 },
          tooltip: {
            renderer: (params: any) => ({
              title: params.datum.date.toLocaleDateString('en-GB'),
              content: `${capitalizeFirst(this.yName)}: ${params.datum.value}`,
            }),
          },
        },
      ],
      legend: { enabled: false},
      axes: [
        {
          type: 'number',
          position: 'left',
          title: {
            text: capitalizeFirst(this.yName),
          },
          label: {
            format: ',.0f',
            fontSize: 10,
          },
        },
        {
          type: 'time',
          position: 'bottom',
          title: {
            text: capitalizeFirst(this.xName),
          },
          label: {
            fontSize: 10,
          },
          crossLines,
        },
      ],
    };
  }

  @HostListener('window:resize')
  onResize(): void {
    this.placeProcessLines();
  }

  /**
   * Puts each strip over its line, using the chart's own layout: its plot
   * area and the time axis' scale (ag-charts 6 internals).
   */
  private async placeProcessLines(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve));  // let the chart get its new options
    const chart = (this.agChart as any)?._chart;
    if (!chart || this.processLines.length === 0) {
      return;
    }
    await chart.waitForUpdate?.();
    const area = chart.seriesRect;
    const axis = chart.axes?.find((a: any) => a.position === 'bottom');
    const canvas = this.element.nativeElement.querySelector('canvas');
    const wrapper = this.element.nativeElement.querySelector('.histogram_wrapper');
    if (!area || !axis || !canvas || !wrapper) {
      return;
    }
    const canvasBox = canvas.getBoundingClientRect(), wrapperBox = wrapper.getBoundingClientRect();
    for (const line of this.processLines) {
      line.left = canvasBox.left - wrapperBox.left + area.x + axis.scale.convert(line.date);
      line.top = canvasBox.top - wrapperBox.top + area.y;
      line.height = area.height;
    }
  }

}

/**
 * The back end only lists days with activity. On a time axis the line would
 * then jump straight across quiet periods, so every missing day is added: 0
 * for daily counts, the previous total for cumulative ones.
 */
export function fillMissingDays(points: { date: Date, value: number }[], cumulative: boolean): { date: Date, value: number }[] {
  const filled: { date: Date, value: number }[] = [];
  for (const point of points) {
    const previous = filled[filled.length - 1];
    if (previous) {
      const day = new Date(previous.date);
      day.setDate(day.getDate() + 1);
      while (day < point.date) {
        filled.push({ date: new Date(day), value: cumulative ? previous.value : 0 });
        day.setDate(day.getDate() + 1);
      }
    }
    filled.push(point);
  }
  return filled;
}

/** Day keys: "dd/mm/yyyy" from the back end, "yyyy-mm-dd" from Decidim's API. */
export function parseKey(key: string): Date | null {
  let match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(key);
  if (match) {
    return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
  }
  match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
}
