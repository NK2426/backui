import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { ModalsModule } from '../../_themes/partials';
import { DropdownMenusModule } from "../../_themes/partials/content/dropdown-menus/dropdown-menus.module";
import { DashboardComponent } from './dashboard.component';

import { roleMapping } from '../../pages/role-mapping';
const roleMappingAll = Object.keys(roleMapping);

import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';
import { WidgetsModule } from 'src/app/_themes/partials/content/widgets/widgets.module';
@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent,
                canActivate: [NgxPermissionsGuard],
                canActivateChild: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['ADMIN', 'HR','WEBTEAM','WHO','CATEGORY_HEAD','PURCHASE_HEAD', 'PURCHASE','VENDOR','CONTENT'],
                        redirectTo: '/dashboard'
                    }
                }
            }
        ]),
        ModalsModule,
        NgApexchartsModule,
        SharedModule, NgxPermissionsModule.forChild(),
        DropdownMenusModule,
        WidgetsModule
    ]
})
export class DashboardModule { }
