import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Bankaccount } from '../../models/bankaccounts';
import { Expense, Expensepaginate } from '../../models/expenses';
import { Expensetypes } from '../../models/expensetypes';
import { BankaccountsService } from '../../services/bankaccounts.service';
import { ExpenseService } from '../../services/expense.service';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesComponent implements OnInit {

  expenses?: Expense[];
  expensesPaginate?: Expensepaginate;
  expensetypes: Expensetypes[] = []
  //searchdepart = 0;
  currentExpense: Expense = {};
  bankaccounts: Bankaccount[] = [];


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

  constructor(private expenseservice: ExpenseService, private modelservice: NgbModal, private toast: ToastService, private utlis: UtilsService, private bankaccountservice: BankaccountsService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.list();

    this.bankaccountservice.findList()
      .subscribe({
        next: data => {
          this.bankaccounts = data;
          // this.cd.detectChanges();
        },
        error: () => {
          this.bankaccounts = []
        }
      });
  }
  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.expenseservice.getAll(params)
      .subscribe({
        next: expenses => {
          this.expenses = expenses.datas;
          if (expenses.totalItems)
            this.count = expenses.totalItems;
          this.cd.detectChanges();
        }, error: error => {
          //this.authRedirect.next(error)
        }
      })
    // this.expenseservice.vendorlist().subscribe({
    //   next: vendors => {
    //     this.vendors = vendors
    //   }
    // })
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

  deleteUser(Expense: Expense): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Expense Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then((parameterResponse) => {
      this.expenseservice.delete(Expense).subscribe({
        next: resp => {
          this.toast.success('Expense Deleted Successfully');
          this.list();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
      // this.cd.detectChanges();
    }, err => {
      //this.toast.failure('Something went wrong.. Expense does not delete.');
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
  editExpense(expense: Expense, value = ''): void {
    this.addAction = true;
    this.viewAction = false;
    let eexpense = Object.assign({}, expense)
    this.currentExpense = eexpense;
  }

  setActiveExpense(content: any, expense: Expense, index: number, value = ''): void {
    this.modelservice.open(content);
    this.currentIndex = index;
    this.currentExpense = expense;
    //this.currentExpense.addValue = value === '' ? false : true;
    this.addAction = false;
    this.viewAction = true;
  }

  numberFormat(num: any) {
    return this.utlis.numberFormat(num);
  }

}
