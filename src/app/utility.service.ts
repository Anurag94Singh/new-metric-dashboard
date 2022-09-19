import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { IChartEvent, IMetricData, ISeries } from './models/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  toggleDrawer = new Subject<boolean>();

  constructor(private datePipe: DatePipe) { }

  convertEpochToTime(metricData: IMetricData[]): IMetricData[] {
    metricData.forEach((metric: IMetricData) => {
      metric.series
        .map((series: ISeries) => series.name = this.datePipe.transform(new Date(Number(series.name) / 1000000), 'LLL,d YYYY hh:mm:ss SSS') || '')
    });
    return metricData;
  }

  groupedDataOverSeconds(metricData: IMetricData[]): IMetricData[] {
    metricData.forEach((metric: IMetricData) => {
      metric.series = metric.series.reduce((res: ISeries[], obj: ISeries) => {
        obj.name = obj.name.substring(0, obj.name.length - 4)
        const group: any = res.find((item: any) => item['name'] == obj.name)
        group ?
          group['value'] += obj.value :
          res.push(obj)
        return res
      }, [])
    });
    return metricData;
  }

  getSeriesLabelList(metricData: IMetricData[]): string[] {
    return metricData.map((metric: IMetricData) =>
      metric.name
    );
  }

  filterByRangeSeries(metricData: IMetricData[], series: any, range: string[]): IMetricData[] {
    if (range.length !== 0) {
      metricData = this.filterMetricByRange(metricData, range, series);
    }
    if (series.length !== 0 && series[0] !== "") {
      metricData = this.filterMetricBySeries(metricData, series, range);
    }
    return metricData;
  }

  filterMetricBySeries(metricData: IMetricData[], series: any, range: string[]): IMetricData[] {
    return metricData.filter((metric: IMetricData) => series.indexOf(metric.name) !== -1);
  }

  filterMetricByRange(metricData: IMetricData[], range: string[], series: any): IMetricData[] {
    metricData.forEach((metric: IMetricData) => {
      metric.series = metric.series.filter((series: ISeries) => 
        new Date(series.name).setHours(0, 0, 0, 0) >= new Date(range[0]).setHours(0, 0, 0, 0) && new Date(series.name).setHours(0, 0, 0, 0) <= new Date(range[1]).setHours(0, 0, 0, 0)
      )
    });
    return metricData;
  }
  getMetricAggSeries(metricData: IMetricData[]): ISeries[] {
    let aggMetricData: ISeries[] = [];
    metricData.forEach((metric: IMetricData) => {
      metric.total = metric.series.reduce((sum, obj: ISeries) => {
        sum = sum + obj.value;
        return sum
      }, 0)
      aggMetricData.push({ name: metric.name, value: metric.total });
    });
    return aggMetricData;
  }

  getMetricNullSeries(metricData: IMetricData[]): ISeries[] {
    let aggMetricData: ISeries[] = [];
    metricData.forEach((metric: IMetricData) => {
      metric.total = metric.series.reduce((sum, obj: ISeries) => {
        if (obj.value === 0) {
          sum++;
        }
        return sum
      }, 0)
      aggMetricData.push({ name: metric.name, value: metric.total });
    });
    return aggMetricData.filter((metric: ISeries) => metric.value > 0);
  }

  getFlatMetricData(metricData: IMetricData[]): IChartEvent[] {
    let aggMetricData: IChartEvent[] = [];
    metricData.forEach((metric: IMetricData) => {
      metric.series.reduce((res: IChartEvent[], obj: ISeries) => {
        res.push({ series: metric.name, name: obj.name, value: obj.value });
        aggMetricData.push({ series: metric.name, name: obj.name, value: obj.value });
        return res
      }, [])
    });
    return aggMetricData;
  }
  
}
