import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensetypesComponent } from './expensetypes.component';

const routes: Routes = [
  
          { path: '', component: ExpensetypesComponent },
    
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensetypesRoutingModule { }
