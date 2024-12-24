import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { UsersRoutingModule } from './users-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserprofileComponent } from './userprofile/userprofile.component';

 

@NgModule({
  declarations: [
    UserprofileComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports:[NgbDatepicker]
})
export class UsersModule { }
