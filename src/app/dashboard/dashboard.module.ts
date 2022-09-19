import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from './charts/charts.component';


import { RouterModule, Routes } from '@angular/router';

import { GenericModule } from '../generic/generic.module';

const routes: Routes = [
  {
    path: '',
    component: ChartsComponent
  }
];

@NgModule({
  declarations: [ChartsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GenericModule
  ]
})
export class DashboardModule { }
