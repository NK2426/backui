import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ThreeWayMatchingRoutingModule } from './three-way-matching.routing';
import { ViewThreeWayMatchingComponent } from './view-three-way-matching/view-three-way-matching.component';



@NgModule({
  declarations: [
    ViewThreeWayMatchingComponent
  ],
  imports: [
    CommonModule,
    ThreeWayMatchingRoutingModule,
    NgbPaginationModule,
    FormsModule
  ]
})
export class ThreeWayMatchingModule { }
