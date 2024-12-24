import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { CatalogRoutingModule } from './catalog.routing';
import { CategoriesComponent } from './component/categories/categories.component';
import { ViewcategoryComponent } from './component/categories/viewcategory/viewcategory.component';
import { NewProductComponent } from './component/inventory/catalog-product/new-product/new-product.component';
import { AddProductComponent } from './component/inventory/catalog-product/add-product/add-product.component';
import { MappingparamsComponent } from './component/inventory/catalog-product/mappingparams/mappingparams.component';
import { ViewProductComponent } from './component/inventory/catalog-product/view-product/view-product.component';
import { EditstoreComponent } from './component/store/editstore/editstore.component';
import { ViewstoreComponent } from './component/store/viewstore/viewstore.component';
import { EditblogComponent } from './component/blogs/editblog/editblog.component';
import { ViewblogComponent } from './component/blogs/viewblog/viewblog.component';
import {  NgxEditorModule } from "ngx-editor";
import { EditeventComponent } from './component/live-events/editevent/editevent.component';
import { VieweventComponent } from './component/live-events/viewevent/viewevent.component';
import { EditnewsletterComponent } from './component/newsletter/editnewsletter/editnewsletter.component';
import { ViewnewsletterComponent } from './component/newsletter/viewnewsletter/viewnewsletter.component';
import { DateTimePickerComponent } from 'src/app/widgets/date-time-picker/date-time-picker.component';
import { ViewTestimonialsComponent } from './component/testimonials/view-testimonials/view-testimonials.component';
import { EditTestimonialsComponent } from './component/testimonials/edit-testimonials/edit-testimonials.component';
import { CancelledInvoiceComponent } from './component/cancelled-invoice/cancelled-invoice.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ScanManifestBasedInvoiceComponent } from './component/inventory/scan-manifest-based-invoice/scan-manifest-based-invoice.component';


@NgModule({
  declarations: [
    CategoriesComponent,
    ViewcategoryComponent,
    NewProductComponent,
    AddProductComponent,
    MappingparamsComponent,
    ViewProductComponent,
    EditstoreComponent,
    ViewstoreComponent,
    // AddblogComponent,
    EditblogComponent,
    ViewblogComponent,
    EditeventComponent,
    VieweventComponent,
    EditnewsletterComponent,
    ViewnewsletterComponent,
    ViewTestimonialsComponent,
    EditTestimonialsComponent,
    CancelledInvoiceComponent,
    ScanManifestBasedInvoiceComponent

  ],
  imports: [
    CommonModule,
    DateTimePickerComponent,
    CatalogRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule,
    NgSelectModule,
    NgxPermissionsModule.forChild(),
    NgbModule,
    NgbDatepicker,
    SharedModule,
    NgxEditorModule,
    ZXingScannerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CatalogModule {}
