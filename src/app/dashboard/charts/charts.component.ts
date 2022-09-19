import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UtilityService } from 'src/app/utility.service';
import { IChartEvent, ILocation, IMetricData } from 'src/app/models/dashboard.interface';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  providers: [DatePipe]
})
export class ChartsComponent implements OnInit {
  seriesSelected = new FormControl(['']);
  seriesList: string[] = [];

  metricData: IMetricData[] = [];
  aggMetricData: IMetricData[] = [];
  chartTitleEveryMilli = 'Metric Values every 200 milliseconds';
  chartTitleEverySecond = 'Aggregated Metric Values every second';
  timeline = true;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Metrics';
  showYAxisLabel = true;
  yAxisLabel = 'Metric Value';
  trimXAxisTicks = true;

  // line, area
  autoScale = true;

  startDate: string = "";
  endDate: string = "";

  constructor(private datePipe: DatePipe, private utility: UtilityService, private location: Location) { }

  ngOnInit(): void {
    this.metricData = JSON.parse(sessionStorage.getItem('metric-data') || '[]');
    this.aggMetricData = this.utility.groupedDataOverSeconds(JSON.parse(JSON.stringify(this.metricData)));
    sessionStorage.setItem('agg-metric-data', JSON.stringify(this.aggMetricData));
    this.seriesList = this.utility.getSeriesLabelList(this.metricData);
    console.log(this.location.getState());
    const seriesSelected = <ILocation>this.location.getState();
    if (seriesSelected?.series) {
      this.seriesSelected = new FormControl([seriesSelected.series]);
      this.onSeriesSelect();
    }
  }

  onSelect(event: IChartEvent, chartType: string) {
    console.log(event)
    this.updateSeriesToAgg(event.series, chartType);
  }

  mouseEnter(event: any) {
    console.log(event)
  }

  mouseLeave(event: any) {
    console.log(event)
  }

  onSeriesSelect(): void {
    console.log(this.seriesSelected.value);
    this.metricData = JSON.parse(sessionStorage.getItem('metric-data') || '[]');
    this.aggMetricData = JSON.parse(sessionStorage.getItem('agg-metric-data') || '[]');
    this.metricData = this.utility.filterByRangeSeries(this.metricData, this.seriesSelected.value, (this.startDate !== "" && this.endDate !== "") ? [this.startDate, this.endDate] : []);
    this.aggMetricData = this.utility.filterByRangeSeries(this.aggMetricData, this.seriesSelected.value, (this.startDate !== "" && this.endDate !== "") ? [this.startDate, this.endDate] : []);
  }

  filterByDate(startDate: any, endDate: any): void { //ngx-charts-timeline
    if (startDate !== "" && endDate !== "") {
      this.startDate = startDate;
      this.endDate = endDate;
      this.metricData = JSON.parse(sessionStorage.getItem('metric-data') || '[]');
      this.aggMetricData = JSON.parse(sessionStorage.getItem('agg-metric-data') || '[]');
      this.metricData = this.utility.filterByRangeSeries(this.metricData, this.seriesSelected.value, [startDate, endDate]);
      this.aggMetricData = this.utility.filterByRangeSeries(this.aggMetricData, this.seriesSelected.value, [startDate, endDate]);
    }
  }
  updateSeriesToAgg(seriesName: string, chartType: string): void {
    if (chartType === "agg-metric") {
      this.metricData = JSON.parse(sessionStorage.getItem('metric-data') || '[]');
      this.metricData = this.utility.filterByRangeSeries(this.metricData, [seriesName], (this.startDate !== "" && this.endDate !== "") ? [this.startDate, this.endDate] : []);
    }
    if (chartType === "metric") {
      this.aggMetricData = JSON.parse(sessionStorage.getItem('agg-metric-data') || '[]');
      this.aggMetricData = this.utility.filterByRangeSeries(this.aggMetricData, [seriesName], (this.startDate !== "" && this.endDate !== "") ? [this.startDate, this.endDate] : []);
    }
  }
}
