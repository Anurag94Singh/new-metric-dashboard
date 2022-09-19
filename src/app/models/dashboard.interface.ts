export interface IMetricData {
    name: string;
    series: ISeries[];
    total?: number;
}

export interface ISeries {
    name: string;
    value: number
}

export interface IChartEvent {
    name: string;
    value: number;
    series: string;
}

export interface ILocation {
    series: string;
    navigation: number;
}