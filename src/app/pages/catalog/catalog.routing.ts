import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ComboListComponent } from './component/combo/combo-list/combo-list.component';
import { UpsertCombosetItemComponent } from './component/combo/upsert-comboset-item/upsert-comboset-item.component';
import { AddgroupComponent } from './component/groups/addgroup/addgroup.component';
import { GroupsComponent } from './component/groups/groups.component';
import { ViewgroupComponent } from './component/groups/viewgroup/viewgroup.component';
import { HomesettingComponent } from './component/homesetting/homesetting.component';
import { AdditemsComponent } from './component/inventory/additems/additems.component';
import { ProductItemsComponent } from './component/inventory/product-items/product-items.component';
import { ProductsComponent } from './component/inventory/products/products.component';
import { StockdetailComponent } from './component/inventory/stockdetail/stockdetail.component';
import { StocksComponent } from './component/inventory/stocks/stocks.component';
import { NotificationComponent } from './component/notification-management/notification/notification.component';
import { UpsertNotificationComponent } from './component/notification-management/upsert-notification/upsert-notification.component';
import { SubcategoriesComponent } from './component/subcategories/subcategories.component';
import { ViewSubcategoriesComponent } from './component/subcategories/view-subcategories/view-subcategories.component';
import { AllTagComponent } from './component/tags/all-tag/all-tag.component';
import { TagDetailComponent } from './component/tags/tag-detail/tag-detail.component';
import { CategoriesComponent } from './component/categories/categories.component';
import { ViewcategoryComponent } from './component/categories/viewcategory/viewcategory.component';
import { AddProductComponent } from './component/inventory/catalog-product/add-product/add-product.component';
import { MappingparamsComponent } from './component/inventory/catalog-product/mappingparams/mappingparams.component';
import { ViewProductComponent } from './component/inventory/catalog-product/view-product/view-product.component';
import { OrdersComponent } from './component/inventory/orders/orders.component';
import { OrderDetailsComponent } from './component/inventory/order-details/order-details.component';
import { InvoiceComponent } from './component/inventory/invoice/invoice.component';
import { InvoicedetailsComponent } from './component/inventory/invoicedetails/invoicedetails.component';
import { WebsettingComponent } from './component/websetting/websetting.component';
import { StoreComponent } from './component/store/store.component';
import { AddstoreComponent } from './component/store/addstore/addstore.component';
import { EditstoreComponent } from './component/store/editstore/editstore.component';
import { ViewstoreComponent } from './component/store/viewstore/viewstore.component';
import { ViewReturnDetailComponent } from './component/return-management/view-return-detail/view-return-detail.component';
import { ReturnInvoiceComponent } from './component/return-invoice/return-invoice.component';
import { ViewReturnInvoiceComponent } from './component/return-invoice/view-return-invoice/view-return-invoice.component';
import { ViewReturnsComponent } from './component/return-management/view-returns/view-returns.component';
import { BlogsComponent } from './component/blogs/blogs.component';

import { LiveEventComponent } from './component/live-events/live-events.component';
import { AddblogComponent } from './component/blogs/addblog/addblog.component';
import { EditblogComponent } from './component/blogs/editblog/editblog.component';
import { ViewblogComponent } from './component/blogs/viewblog/viewblog.component';
import { ManifestInvoiceComponent } from '../warehouse/component/packing-order/manifest-invoice/manifest-invoice.component';
import { AddeventComponent } from './component/live-events/addevent/addevent.component';
import { EditeventComponent } from './component/live-events/editevent/editevent.component';
import { VieweventComponent } from './component/live-events/viewevent/viewevent.component';
import { NewwebpagesettingComponent } from './component/newwebpagesetting/newwebpagesetting.component';
import { NewsletterComponent } from './component/newsletter/newsletter.component';
import { AddnewsletterComponent } from './component/newsletter/addnewsletter/addnewsletter.component';
import { EditnewsletterComponent } from './component/newsletter/editnewsletter/editnewsletter.component';
import { ViewnewsletterComponent } from './component/newsletter/viewnewsletter/viewnewsletter.component';
import { VideocalComponent } from './component/videocal/videocal.component';
import { TestimonialsComponent } from './component/testimonials/testimonials.component';
import { AddTestimonialsComponent } from './component/testimonials/add-testimonials/add-testimonials.component';
import { EditTestimonialsComponent } from './component/testimonials/edit-testimonials/edit-testimonials.component';
import { ViewTestimonialsComponent } from './component/testimonials/view-testimonials/view-testimonials.component';
import { AllInvoicesShippedComponent } from './component/shipped-invoices/all-invoices-shipped/all-invoices-shipped.component';
import { ViewShippedInvoiceComponent } from './component/shipped-invoices/view-shipped-invoice/view-shipped-invoice.component';
import { CancelledInvoiceComponent } from './component/cancelled-invoice/cancelled-invoice.component';
import { CancelInvoicedetailsComponent } from './component/cancelled-invoice/view-invoice/invoicedetails/invoicedetails.component';
import { ScanManifestBasedInvoiceComponent } from './component/inventory/scan-manifest-based-invoice/scan-manifest-based-invoice.component';
const routes: Routes = [
    /*product*/
    {
        path: 'products', component: ProductsComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'editproduct/:uuid', component: AdditemsComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'stocks/:uuid', component: StocksComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'stocks/detail/:uuid', component: StockdetailComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },

    {
        path: 'productitems', component: ProductItemsComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },


    {
        path: 'combo', component: ComboListComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'combo/add/:id', component: UpsertCombosetItemComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },

    {
        path: 'video', component: VideocalComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },

    {
        path: 'tags', component: AllTagComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'tags/:tagID', component: TagDetailComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },



    {
        path: 'homesetting/:type', component: HomesettingComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
   
    {
        path: 'homesettings/:type', component: WebsettingComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },

    {
        path: 'subcategories', component: SubcategoriesComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'subcategories/view/:uuid', component: ViewSubcategoriesComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'categories', component: CategoriesComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'categories/view/:uuid', component: ViewcategoryComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },

    {
        path: 'groups', component: GroupsComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'groups/add', component: AddgroupComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'groups/edit/:uuid', component: AddgroupComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'groups/view/:uuid', component: ViewgroupComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },

    {
        path: 'notifications', component: NotificationComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'notifications/:notificationID', component: UpsertNotificationComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'stores', component: StoreComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'add-store', component: AddstoreComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'edit-store/:id', component: EditstoreComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'view-store/:id', component: ViewstoreComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'blogs', component: BlogsComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'news', component: NewsletterComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'live-events', component: LiveEventComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'testimonials', component: TestimonialsComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'add-testimonials', component: AddTestimonialsComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'add-blog', component: AddblogComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'edit-blog/:id', component: EditblogComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'edit-testimonials/:id', component: EditTestimonialsComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'view-testimonials/:id', component: ViewTestimonialsComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'view-blog/:id', component: ViewblogComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'add-newsletter', component: AddnewsletterComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'edit-newsletter/:id', component: EditnewsletterComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'view-newsletter/:id', component: ViewnewsletterComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'add-event', component: AddeventComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'edit-event/:id', component: EditeventComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'view-event/:id', component: VieweventComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['WEBTEAM', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    // Catalog Product
    // {
    //     path: 'new-product',
    //     component: NewProductComponent
    // },
    {
        path: 'add-product',
        component: AddProductComponent
    },
    {
        path: 'mappingparams/:uuid',
        component: MappingparamsComponent
    },
    {
        path: 'view-product/:uuid',
        component: ViewProductComponent
    },
    {
        path: 'orders',
        component: OrdersComponent
    },
    {
        path: 'order-details/:orderuuid',
        component: OrderDetailsComponent
    },
    {
        path: 'invoice',
        component: InvoiceComponent
    },
    {
        path: 'invoice/:invoicenumber',
        component: InvoicedetailsComponent
    },
    {
        path: 'returns', component: ViewReturnsComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['WEBTEAM', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'returns/:returnuuid', component: ViewReturnDetailComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['WEBTEAM', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
    
      {
        path: 'returninvoices', component: ReturnInvoiceComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['WEBTEAM', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'returninvoices/:returnuuid', component: ViewReturnInvoiceComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['WEBTEAM', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'manifest', component: ScanManifestBasedInvoiceComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['WEBTEAM', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'shipped-invoices', component: AllInvoicesShippedComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['WEBTEAM', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'shipped-invoices/:invoicenumber', component: ViewShippedInvoiceComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['WEBTEAM', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'cancelled-invoices', component: CancelledInvoiceComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['WEBTEAM', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'cancelled-invoices/:invoicenumber', component: CancelInvoicedetailsComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['WEBTEAM', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogRoutingModule { }
