import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ToastService } from 'src/app/_helpers/toast.service';
import { vendorAgentService } from 'src/app/pages/hr/services/vendorAgent.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Purchaseorder, Vendor } from '../../../models/purchaseorder';
import { PurchaseorderService } from '../../../services/purchaseorder.service';
import { vendoragent } from 'src/app/pages/hr/models/vendoragent';
import { VendorService } from '../../../services/vendor.service';
import { State } from '../../../models/vendor';

@Component({
  selector: 'app-addagent',
  templateUrl: './addagent.component.html',
  styleUrls: ['./addagent.component.scss']
})
export class AddagentComponent implements OnInit {
  @Input() data: vendoragent = {};
  @Output() refreshList = new EventEmitter<string>();
  formData!: FormGroup;
  submit: Boolean = false;
  vendors: Vendor[] = [];
  states?: State[];
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize: any = 10;
  pageSizes = [10, 20, 30, 50, 100];
  constructor(
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private porderservice: PurchaseorderService,
    private cdr: ChangeDetectorRef,
    private userservice: VendorService,
    private vendorAgentService: vendorAgentService
  ) { }

  ngOnInit(): void {
    this.porderservice.allvendor('3').subscribe({
      next: (data) => {
        this.vendors = data;
      }
    });
    this.userservice.getStates().subscribe({
      next: (resp) => {
        this.states = resp.data;
      },
      error: (error) => { }
    });
    this.formData = this.formBuilder.group({
      // uuid: [this.data.uid],
      id: [this.data.id],
      name: [this.data.name, [Validators.required]],
      address: [this.data.address, [Validators.required]],
      state_id: [this.data.state_id, [Validators.required]],
      email: [this.data.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      phone: [this.data.mobile, [Validators.required, Validators.minLength(10), Validators.pattern('[0-9]+'), Validators.maxLength(10)]]
    });
  }

  get form() {
    return this.formData.controls;
  }

  cancelAction(): void {
    let type = 'cancel1';
    if (!this.data.uuid) {
      type = '';
    }
    this.refreshList.emit(type);
  }

  saveProductvariants(): void {
    // console.log(this.formData.value);
    this.submit = true;

    if (this.formData.invalid) {
      // console.log(this.formData.value);
      return;
    }
    // let search = this.formData.get('address').value;
    // search = search.split(',').join(',<br>');
    // this.formData.get('address').setValue(search);
    // console.log(search, this.formData.get('address').value);

    if (this.data.id != null) {
      this.vendorAgentService.update(this.formData.value).subscribe({
        next: (resp) => {
          //console.log("resp data");
          //console.log(resp);
          this.toast.success('Vendor Agent Updated Successfully');
          this.refreshList.emit('refresh');
          this.data = {};
          this.formData.reset();
          this.submit = false;
        },
        error: (err) => {
          //console.log("else error");
          this.toast.failure(err);
        }
      });
    } else {
      this.formData.value.range_from = this.formData.value.range_from == null ? 0 : this.formData.value.range_from;
      this.formData.value.range_to = this.formData.value.range_to == null ? 0 : this.formData.value.range_to;
      this.vendorAgentService.create(this.formData.value).subscribe({
        next: (resp) => {
          this.toast.success('Vendor Agent Created Successfully');
          this.refreshList.emit('refresh');
          this.data = {};
          this.formData.reset();
        },
        error: (err) => {
          //console.log("else error");
          this.toast.failure(err);
        }
      });
    }
  }
}
