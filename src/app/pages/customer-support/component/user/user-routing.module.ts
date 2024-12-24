import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRatingComponent } from './user-rating/user-rating/user-rating.component';
import { ViewUserComponent } from './view-user/view-user/view-user.component';

const routes: Routes = [
    { path: '', component: ViewUserComponent },
    { path: 'user-rating', component: UserRatingComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }
