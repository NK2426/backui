import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { TokenStorageService } from 'src/app/pages/hr/services/token-storage.service';
import { Bankaccount } from '../../../models/bankaccounts';
import { BankaccountsService } from '../../../services/bankaccounts.service';

@Component({
  selector: 'app-addbankaccount',
  templateUrl: './addbankaccount.component.html',
  styleUrls: ['./addbankaccount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddbankaccountComponent implements OnInit {

  formData!: FormGroup;
  data: Bankaccount = {};
  units: Array<{ id: number, name: string }> = [{ id: 1, name: 'Box' }, { id: 2, name: 'Pieces' }, { id: 3, name: 'Units' }, { id: 4, name: 'Kilograms' }, { id: 5, name: 'Grams' }];
  statuses: Array<{ id: number, name: string }> = [{ id: 1, name: 'Active' }, { id: 0, name: 'Inactive' }];
  active = 1;
  submit: boolean = false;
  breadCrumbItems: Array<{}> = [];
  edit: boolean = false;

  constructor(
    private route: ActivatedRoute, private router: Router,
    private bankaccountservice: BankaccountsService, private toast: ToastService,
    private storage: TokenStorageService, private formBuilder: FormBuilder,
    private utiltiyservice: UtilsService, private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      //uuid: [this.data.uuid, [Validators.required, Validators.minLength(4)]],
      accountname: [this.data.accountname, [Validators.required, Validators.minLength(3)]],
      //sku: [this.data.sku, [Validators.required, Validators.minLength(3)]],
      accountnumber: [this.data.accountnumber, [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(6)]],
      bankname: [this.data.bankname, [Validators.required]],
      ifsc: [this.data.ifsc, [Validators.required]],
      type: [this.data.type],
      description: [this.data.description],
      status: ['1'],
    });

    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.bankaccountservice.find(uuid)
        .subscribe({
          next: data => {
            this.data = data;
            this.edit = true;
            this.formData.setValue({
              accountname: data.accountname,
              accountnumber: data.accountnumber,
              bankname: data.bankname,
              ifsc: data.ifsc,
              type: data.type,
              description: data.description,
              status: data.status,
            });
            this.cd.detectChanges();
          },
          error: () => {
          }
        });
    }
  }
  get form() {
    return this.formData.controls;
  }

  saveBankaccount() {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.data.uuid != null) {
      let bankaccountdata = this.formData.value;
      bankaccountdata.uuid = this.data.uuid;

      this.bankaccountservice.update(bankaccountdata).subscribe({
        next: resp => {
          this.toast.success('Bankaccount Updated Successfully');
          this.data = {};
          this.formData.reset();
          this.submit = false;
          this.router.navigate(['/finance/bankaccounts']);
          // this.cd.detectChanges();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    } else {
      this.bankaccountservice.create(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('Bankaccount Created Successfully');
          this.data = {}
          this.formData.reset();
          this.router.navigate(['/finance/bankaccounts']);
          // this.cd.detectChanges();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }
}
