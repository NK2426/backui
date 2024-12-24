import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AddproductComponent } from './component/addproduct/addproduct.component';
import { ProductsComponent } from './component/products/products.component';
import { ReqproductComponent } from './component/reqproduct/reqproduct.component';
import { VariantmappingComponent } from './component/variantmapping/variantmapping.component';
import { AddvendorComponent } from './component/vendor/addvendor/addvendor.component';
import { VendorComponent } from './component/vendor/vendor.component';
import { ViewvendorComponent } from './component/vendor/viewvendor/viewvendor.component';
import { ViewproductComponent } from './component/viewproduct/viewproduct.component';
import { VendoragentComponent } from './component/vendoragent/vendoragent.component';

const routes: Routes = [
    /*product*/
    {
        path: 'products', component: ProductsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['CATEGORY_HEAD', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'view/:uuid', component: ViewproductComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['CATEGORY_HEAD', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'edit/:uuid', component: AddproductComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['CATEGORY_HEAD', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'add', component: AddproductComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['CATEGORY_HEAD', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },
    // { path: 'mappingparams/:uuid', component: MapparamsComponent },
    {
        path: 'mappingparams/:uuid', component: VariantmappingComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['CATEGORY_HEAD', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },

    /*Vendor*/
    {
        path: 'vendors', component: VendorComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['VENDOR', 'ADMIN', 'PURCHASE_HEAD', 'CATEGORY_HEAD', 'PURCHASE'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'vendoragent', component: VendoragentComponent,
        // canActivate: [NgxPermissionsGuard],
        // canActivateChild: [NgxPermissionsGuard],
        data: {
            Permissions: {
                only: ['VENDOR', 'ADMIN', 'PURCHASE_HEAD', 'CATEGORY_HEAD', 'PURCHASE'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'vendor/add', component: AddvendorComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['VENDOR', 'ADMIN', 'CATEGORY_HEAD', 'PURCHASE'],
                redirectTo: '/dashboard'
            }
        }
    },
    {
        path: 'vendor/edit/:uuid', component: AddvendorComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['VENDOR', 'ADMIN', 'CATEGORY_HEAD', 'PURCHASE'],
                redirectTo: '/dashboard'
            }
        }
    },

    {
        path: 'vendor/view', component: ViewvendorComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['VENDOR', 'ADMIN', 'CATEGORY_HEAD', 'PURCHASE_HEAD', 'PURCHASE'],
                redirectTo: '/dashboard'
            }
        }
    },

    /*Request Approval*/
    {
        path: 'request', component: ReqproductComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['CATEGORY_HEAD', 'ADMIN'],
                redirectTo: '/dashboard'
            }
        }
    },

    /* Product Parameters*/
    {
        path: 'productparameters',
        loadChildren: () => import('./component/productparameters/productparameters.module').then((m) => m.ProductparametersModule),
    },

    {
        path: 'brands',
        loadChildren: () => import('./component/brands/brands.module').then(m => m.BrandsModule)
    },
    {
        path: 'groups',
        loadChildren: () => import('./component/groups/groups.module').then(m => m.GroupsModule)
    },

    /*tax*/
    {
        path: 'tax', loadChildren: () => import('./component/tax/tax.module').then(m => m.TaxModule)
    },
    /* payment term*/
    {
        path: 'payment',
        loadChildren: () => import('./component/payment/payment.module').then(payment => payment.PaymentModule)
    },
    {
        path: 'categories',
        loadChildren: () => import('./component/categories/categories.module').then(m => m.CategoriesModule),
    },
    {
        path: 'subcategories',
        loadChildren: () => import('./component/subcategories/subcategories.module').then(m => m.SubcategoriesModule),
    },
    {
        path: 'productvariant',
        loadChildren: () => import('./component/productvariants/productvariants.module').then(m => m.ProductvariantsModule),
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryHeadRoutingModule { }
