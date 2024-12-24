import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { CategoryHeadRoutingModule } from './category-head.routing';
import { MapparamsComponent } from './component/mapparams/mapparams.component';
import { ReqproductComponent } from './component/reqproduct/reqproduct.component';
import { VariantmappingComponent } from './component/variantmapping/variantmapping.component';
import { VendoragentComponent } from './component/vendoragent/vendoragent.component';
import { AddagentComponent } from './component/vendoragent/addagent/addagent.component';
import { ViewagentComponent } from './component/vendoragent/viewagent/viewagent.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { EditvendorComponent } from './component/vendor/editvendor/editvendor.component';

@NgModule({
    declarations: [ReqproductComponent, MapparamsComponent, VariantmappingComponent, AddagentComponent, ViewagentComponent, VendoragentComponent, EditvendorComponent],
    imports: [CommonModule, CategoryHeadRoutingModule, FormsModule, ReactiveFormsModule, NgSelectModule, RouterModule, NgSelectModule,
        NgbModule, NgxPermissionsModule.forChild(),
        NgbDatepicker,
        SharedModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class CategoryHeadModule { }
