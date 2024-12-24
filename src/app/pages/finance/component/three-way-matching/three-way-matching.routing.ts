import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewThreeWayMatchingComponent } from './view-three-way-matching/view-three-way-matching.component';

const routes: Routes = [
    { path: '', component: ViewThreeWayMatchingComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ThreeWayMatchingRoutingModule { }
