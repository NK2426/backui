import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
// import { SortableDirectiveModule } from 'src/app/helpers/directives/advance-sortable.directive';
import { UserRatingComponent } from './user-rating/user-rating/user-rating.component';
import { UsersRoutingModule } from './user-routing.module';
import { ViewUserComponent } from './view-user/view-user/view-user.component';
import { SharedModule } from 'src/app/_themes/shared/shared.module';



@NgModule({
  declarations: [
    ViewUserComponent,
    UserRatingComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    NgbPaginationModule,
    // SortableDirectiveModule
    SharedModule
  ]
})
export class UserModule { }
