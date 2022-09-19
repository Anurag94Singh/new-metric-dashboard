import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IChartEvent, IMetricData, ISeries } from '../models/dashboard.interface';
import { UtilityService } from '../utility.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  chartTitleAggMetric = "Metric Aggregated Values";
  nullMetricChartTitle = "Metrics with null values"
  metricRawData = "Metric's Raw Data";
  metricAggData: ISeries[] = [];
  nullMetricSeries: ISeries[] = [];
  flatMetricData: any[] = []
  view: any = [600, 200];

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';

  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Metrics';
  showYAxisLabel = true;
  yAxisLabel = 'No. of Null values';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  displayedColumns: string[] = ['series', 'name', 'value'];
  dataSource = new MatTableDataSource<any>(this.flatMetricData);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    this.onPieSeriesSelect(data?.name);

  }

  // onActivate(data): void {
  //   console.log('Activate', JSON.parse(JSON.stringify(data)));
  // }

  // onDeactivate(data): void {
  //   console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  // }
  constructor(private utility: UtilityService) {}

  ngOnInit(): void {
    let metricData = JSON.parse(sessionStorage.getItem('metric-data') || '[]');
    metricData = JSON.parse(JSON.stringify(metricData));
    this.metricAggData = this.utility.getMetricAggSeries(metricData);
    this.nullMetricSeries = this.utility.getMetricNullSeries(metricData);
    this.flatMetricData = this.utility.getFlatMetricData(metricData);
    this.dataSource = new MatTableDataSource<any>(this.flatMetricData);
    //sessionStorage.setItem('agg-metric-data', JSON.stringify(this.aggMetricData));
  }

  onPieSeriesSelect(seriesName: string): void {
    // console.log(this.seriesSelected.value);
    let metricData = JSON.parse(sessionStorage.getItem('metric-data') || '[]');
    this.flatMetricData = this.utility.getFlatMetricData(metricData).filter((series: IChartEvent) => series.series === seriesName);
    this.dataSource = new MatTableDataSource<any>(this.flatMetricData);
    this.dataSource.paginator = this.paginator;
  }
}
