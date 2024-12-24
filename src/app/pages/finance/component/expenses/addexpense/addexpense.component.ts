import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { TokenStorageService } from 'src/app/pages/hr/services/token-storage.service';
import { Bankaccount } from '../../../models/bankaccounts';
import { Expense } from '../../../models/expenses';
import { Expensetypes } from '../../../models/expensetypes';
import { BankaccountsService } from '../../../services/bankaccounts.service';
import { ExpenseService } from '../../../services/expense.service';
import { ExpensetypesService } from '../../../services/expensetypes.service';
import { WarehouseList } from '../../../models/financeReport';

//import {saveAs} from 'file-saver';
@Component({
  selector: 'app-addexpense',
  templateUrl: './addexpense.component.html',
  styleUrls: ['./addexpense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddexpenseComponent implements OnInit {

  formData!: FormGroup;
  data: Expense = {};
  active = 1;
  submit: boolean = false;
  statuses: Array<{ id: string, name: string }> = [];
  breadCrumbItems: Array<{}> = [];
  edit: boolean = false;
  expensetypes: Expensetypes[] = []
  bankaccounts: Bankaccount[] = [];
  addfile: string = '';
  baseurl: string = '';
  fileName: any = '';

  constructor(
    private route: ActivatedRoute, private router: Router,
    private expenseservice: ExpenseService, private toast: ToastService,
    private storage: TokenStorageService, private formBuilder: FormBuilder,
    private utility: UtilsService,
    private bankaccountservice: BankaccountsService,
    private expensetypeservice: ExpensetypesService,
    private env: EnvService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.baseurl = this.env.SITE_URL;
    this.statuses = this.utility.getStatus();
    this.getAllWarehouse();
    this.formData = this.formBuilder.group({
      //uuid: [this.data.uuid, [Validators.required, Validators.minLength(4)]],
      expensetype_id: [this.data.expensetype_id, [Validators.required]],
      bankaccount_id: [this.data.bankaccount_id, [Validators.required]],
      amount: [this.data.amount, [Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'), Validators.required]],
      description: [this.data.description],
      warehouse_id: [this.data.warehouse_id],
      file: [this.data.file],
      expensedate: [this.data.expensedate, [Validators.required]],
      status: ['1'],
    });

    this.bankaccountservice.findList()
      .subscribe({
        next: data => {
          this.bankaccounts = data;
          // console.log(this.bankaccounts)
          this.expensetypeservice.findList().subscribe({
            next: exptypedata => {
              this.expensetypes = exptypedata;
              let uuid = this.route.snapshot.paramMap.get('uuid');
              if (uuid) {
                this.expenseservice.find(uuid)
                  .subscribe({
                    next: data => {
                      this.data = data;
                      this.edit = true;
                      this.fileName = this.data.file;
                      this.formData.setValue({
                        expensetype_id: this.data.expensetype_id,
                        bankaccount_id: this.data.bankaccount_id,
                        warehouse_id: this.data.warehouse_id,
                        amount: this.data.amount,
                        description: this.data.description,
                        file: '',
                        expensedate: this.data.expensedate,
                        status: this.data.status,
                      });
                      //this.cd.detectChanges();
                      //this.getSelectvalues('edit')
                    },
                    error: () => {
                      this.expensetypes = []
                    }
                  });
              }
            }
          })
          this.cd.detectChanges();
        },
        error: () => {
          this.bankaccounts = []
        }
      });
  }
  get form() {
    return this.formData.controls;
  }

  warehouseData: WarehouseList[] = [];
  getAllWarehouse() {
    this.expenseservice.getAllWarehouse().subscribe({
      next: (resp: any) => {
        this.warehouseData = resp.data;
        this.cd.detectChanges();
      }
    })
  }

  saveExpense() {
    // console.log(this.formData.value)
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.data.uuid != null) {
      let expensedata = this.formData.value;
      expensedata.uuid = this.data.uuid;
      if (expensedata.file == null) {
        expensedata.file = this.fileName
        this.expenseservice.update(expensedata).subscribe({
          next: resp => {
            this.toast.success('Expense Updated Successfully');
            this.data = {};
            this.formData.reset();
            this.submit = false;
            this.router.navigate(['/app/expenses']);
            //this.cd.detectChanges();
          }, error: err => {
            this.toast.failure(err.error.message);
          }
        })
      }
      else
        this.newimage()

    } else {
      if (this.formData.value.file == null) {
        // console.log(this.formData.value)
        this.formData.value.file = this.fileName
        this.expenseservice.create(this.formData.value).subscribe({
          next: resp => {
            this.toast.success('Expense Created Successfully');
            this.data = {};
            this.formData.reset();
            this.router.navigate(['/finance/expenses']);
            //this.cd.detectChanges();
          }, error: err => {
            this.toast.failure(err.error.message);
          }
        })
      }
      else
        // console.log("file empty")
      this.newimage()

      // this.expenseservice.create(this.formData.value).subscribe({
      //   next: resp => {
      //     this.toast.success('Expense Created Successfully');
      //     this.data = {}
      //     this.formData.reset();
      //     this.router.navigate(['/app/expenses/mapping/'+resp.uuid]);
      //   }, error: err => {
      //     this.toast.failure(err.error.message);
      //   }
      // })
    }
  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.addfile = file
    }
  }
  newimage() {
    const formd: any = new FormData();
    formd.append('file', this.addfile);
    formd.append('expensedate', this.formData.value.expensedate);
    formd.append('expensetype_id', this.formData.value.expensetype_id);
    formd.append('bankaccount_id', this.formData.value.bankaccount_id);
    formd.append('amount', this.formData.value.amount);
    formd.append('warehouse_id', this.formData.value.warehouse_id);
    formd.append('description', this.formData.value.description != null ? this.formData.value.description : '');
    formd.append('status', this.formData.value.status);
    var msg = 'Created';
    if (this.data.uuid) {
      formd.append('uuid', this.data.uuid);
      msg = 'Updated';
    }
    this.expenseservice.saveData(formd).subscribe({
      next: resp => {
        this.addfile = '';
        this.data = {};
        this.formData.reset();
        this.submit = false;
        this.toast.success('Expense Successfully ' + msg);
        this.router.navigate(['/finance/expenses']);
        //this.cd.detectChanges();
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    });
  }

  // onFileClick(event:any)
  // {
  //   event.preventDefault();        
  //   const filename=event.currentTarget.getAttribute('href');
  //   this.expenseservice.download(filename).subscribe({
  //     next:resp => {
  //       let downloadURL = window.URL.createObjectURL(resp);
  //       saveAs(downloadURL,filename.split('-')[1]);
  //     },error: err => {
  //       this.toast.failure("Error while download file : " + err.error.message);
  //     }
  //   });
  // }

}
