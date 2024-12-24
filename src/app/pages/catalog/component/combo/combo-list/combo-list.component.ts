import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { BULKORDER } from '../../../models/combo';
import { ComboService } from '../../../services/combo.service';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateComboComponent } from '../create-combo/create-combo.component';

@Component({
  selector: 'app-combo-list',
  templateUrl: './combo-list.component.html',
  styleUrls: ['./combo-list.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule, CreateComboComponent]
})
export class ComboListComponent implements OnInit {
  comboList: BULKORDER.Combo[] = [];
  comboData!: BULKORDER.ComboPaginate;
  currentCombo!: BULKORDER.Combo;
  currentIndex = -1;

  // Pagination and search config
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  constructor(private comboService: ComboService, private cdr: ChangeDetectorRef, private modalService: NgbModal, private router: Router, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.getComboList();
  }

  // Open a modal to create new combo 
  addNewCombo(content: any) {
    this.modalService.open(content);
  }

  getComboList(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    this.comboService.getComboList(params).subscribe({
      next: (combo) => {
        this.comboList = combo.datas || [];
        // this.cdr.detectChanges();
        if (combo.totalItems) this.count = combo.totalItems;
      },
      error: (error) => {
        this.toast.failure('Error retriving the list, Try again!');
      }
    });
  }

  deleteCombo(combo: BULKORDER.Combo) {
    if (confirm('Are you sure you want to delete this combo?')) {
      if (combo) {
        this.comboService.deleteCombo(combo.id).subscribe({
          next: (combo) => {
            if (combo) {
              this.toast.success('Combo Deleted Successfully');
              this.getComboList();
            }
            // this.cdr.detectChanges();
          },
          error: (error) => {
            this.toast.failure('Error retriving the list, Try again!');
          }
        });
      }
    }

  }
  handlePageChange(event: number): void {
    this.page = event;
    this.getComboList();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getComboList();
  }

  refreshList(type: any): void {
    if (type == 'cancel') {
      this.modalService.dismissAll();
    } else {
      this.modalService.dismissAll();
      if (type == 'refresh')
        this.getComboList();
    }

  }

  publishComboSet(combo: BULKORDER.Combo | any, comboSetIndex: number) {

    this.comboService.publishCombo(combo?.id).subscribe({
      next: (resp: any) => {
        if (resp && resp.message) {
          this.toast.success(resp.message);
          this.getComboList();
          // this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        if (err && err.error && err.error.message) {
          this.toast.failure(err.error.message);
        } else {
          this.toast.failure('Error Saving Combo Set');
        }
      }
    });
  }
}
