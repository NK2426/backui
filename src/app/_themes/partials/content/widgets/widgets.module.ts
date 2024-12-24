import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { MixedWidget1Component } from './mixed/mixed-widget1/mixed-widget1.component';
import { MixedWidget4Component } from './mixed/mixed-widget4/mixed-widget4.component';

// Other
import { DropdownMenusModule } from '../dropdown-menus/dropdown-menus.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ChartsWidget1Component } from './charts/charts-widget1/charts-widget1.component';
import { ChartsWidget2Component } from './charts/charts-widget2/charts-widget2.component';
import { ChartsWidget3Component } from './charts/charts-widget3/charts-widget3.component';
import { ChartsWidget4Component } from './charts/charts-widget4/charts-widget4.component';

import { MixedWidget2Component } from './mixed/mixed-widget2/mixed-widget2.component';
import { MixedWidget3Component } from './mixed/mixed-widget3/mixed-widget3.component';

import { SharedModule } from '../../../shared/shared.module';
@NgModule({
  declarations: [
    // Mixed
    MixedWidget1Component,
    MixedWidget4Component,

    ChartsWidget1Component,
    ChartsWidget2Component,
    ChartsWidget3Component,
    ChartsWidget4Component,

    MixedWidget2Component,
    MixedWidget3Component
  ],
  imports: [CommonModule, DropdownMenusModule, InlineSVGModule, NgApexchartsModule, NgbDropdownModule, SharedModule],
  exports: [
    // Advanced Tables

    // Mixed
    MixedWidget1Component,
    MixedWidget4Component,

    // Tiles,

    ChartsWidget1Component,
    ChartsWidget2Component,
    ChartsWidget3Component,
    ChartsWidget4Component,

    MixedWidget2Component,
    MixedWidget3Component
  ]
})
export class WidgetsModule {}
