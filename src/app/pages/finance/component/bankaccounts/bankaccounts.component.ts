import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Bankaccount, Bankaccountpaginate } from '../../models/bankaccounts';
import { BankaccountsService } from '../../services/bankaccounts.service';


@Component({
  selector: 'app-bankaccounts',
  templateUrl: './bankaccounts.component.html',
  styleUrls: ['./bankaccounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankaccountsComponent implements OnInit {

  bankaccounts?: Bankaccount[];
  bankaccountsPaginate?: Bankaccountpaginate;
  currentBankaccount: Bankaccount = {};


  addAction = false;
  viewAction = false;
  viewValue = false;
  currentIndex = -1;

  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(private Bankaccountservice: BankaccountsService, private modelservice: NgbModal, private toast: ToastService, private utlis: UtilsService, private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.list();
  }
  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.Bankaccountservice.getAll(params)
      .subscribe({
        next: bankaccounts => {
          this.bankaccounts = bankaccounts.datas;
          if (bankaccounts.totalItems)
            this.count = bankaccounts.totalItems;
          this.cd.detectChanges();
        }, error: error => {
          //this.authRedirect.next(error)
        }
      })
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.list();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.list();
  }

  deleteBankaccount(Bankaccount: Bankaccount): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Bankaccount Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then((parameterResponse) => {
      this.Bankaccountservice.delete(Bankaccount).subscribe({
        next: resp => {
          this.toast.success('Bank Account Deleted Successfully');
          this.list();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }, err => {
      //this.toast.failure('Something went wrong.. Product does not delete.');
    });
  }
  refreshList(type: any): void {
    this.addAction = false;
    if (type == 'cancel') {
      this.viewAction = true;
    } else {
      this.modelservice.dismissAll();
      if (type == 'refresh')
        this.list();
      this.currentIndex = -1;
    }
  }
  editProduct(bankaccount: Bankaccount, value = ''): void {
    this.addAction = true;
    this.viewAction = false;
    let ebankaccount = Object.assign({}, bankaccount)
    this.currentBankaccount = ebankaccount;
  }

  setActiveProduct(content: any, bankaccount: Bankaccount, index: number, value = ''): void {
    this.modelservice.open(content);
    this.currentIndex = index;
    this.currentBankaccount = bankaccount;
    //this.currentProduct.addValue = value === '' ? false : true;
    this.addAction = false;
    this.viewAction = true;
  }
}
