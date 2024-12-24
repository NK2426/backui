import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsreceiptComponent } from './goodsreceipt.component';
import { GrnComponent } from './grn/grn.component';

const routes: Routes = [
  { path: '', component: GoodsreceiptComponent },
  { path: 'grn/:id', component: GrnComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsreceiptRoutingModule { }
