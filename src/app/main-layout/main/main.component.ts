import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { HttpService } from 'src/app/http.service';
import { IMetricData } from 'src/app/models/dashboard.interface';
import { UtilityService } from 'src/app/utility.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [DatePipe]
})
export class MainComponent implements OnInit {
  opened= true;
  metricData:any;
  @ViewChild('drawer') drawer: any;
  subscription: Subscription = new Subscription();

  constructor(private httpService: HttpService, private datePipe: DatePipe, private utility: UtilityService) { }

  ngOnInit(): void {
    this.httpService.getMetricData()
        .subscribe((data: IMetricData[]) => {
          this.metricData = this.utility.convertEpochToTime(data);
          sessionStorage.setItem('metric-data', JSON.stringify(data));
          console.log(this.metricData)
        })

      this.subscription.add(
        this.utility.toggleDrawer
            .subscribe(data => {
              this.drawer.toggle();
            })
      );
  }

}
