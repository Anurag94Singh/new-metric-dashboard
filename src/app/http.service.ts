import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMetricData } from './models/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  getMetricData(): Observable<IMetricData[]> {
    return this.httpClient.get<IMetricData[]>("assets/json/test.json");
  }
}
