import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseorderComponent } from './purchaseorder.component';
import { ViewComponent } from './view/view.component';


const routes: Routes = [
          { path: 'po', component: PurchaseorderComponent },
          { path: 'po/:status', component: PurchaseorderComponent },
          { path: 'view/:uuid', component: ViewComponent  },
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseorderRoutingModule { }
