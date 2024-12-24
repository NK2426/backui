import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Warehouse } from '../../../models/warehouse';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseManagerService } from '../../../services/warehousemanager.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { State } from 'src/app/pages/catalog/models/postalcodes';

@Component({
  standalone: true,
  selector: 'app-add-warehouse',
  templateUrl: './add-warehouse.component.html',
  styleUrls: ['./add-warehouse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    RouterModule,
    QRCodeModule,
    ZXingScannerModule,
    NgbPaginationModule
  ]
})
export class AddWarehouseComponent implements OnInit {
  @Input() data: Warehouse = {};
  states?: State[];
  formData!: FormGroup;
  warehouses: Warehouse[];
  submit: boolean = false;

  edit: boolean = false;

  constructor(
    private warehouseservice: WarehouseManagerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      name: [this.data.name, [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(10), Validators.maxLength(10)]],
      address: [this.data.address, [Validators.required]],
      address1: [this.data.address1, [Validators.required]],
      address2: [this.data.address2, [Validators.required]],
      state_id: [this.data.address2, [Validators.required]],
      billingaddress: [this.data.billingaddress, [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(5), Validators.maxLength(6)]],
      gstin:[this.data.gstin ,[Validators.required,Validators.minLength(15), Validators.maxLength(15)]],
      status: ['1']
    });

    this.warehouseservice.getStates().subscribe({
      next: (resp) => {
        this.states = resp.data;
        this.cdr.detectChanges();
      },
      error: (error) => {}
    });
  }
  get form() {
    return this.formData.controls;
  }
  back() {
    this.router.navigate(['/warehouse/warehouse-list']);
  }
  save() {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    let search = this.formData.get('billingaddress').value;
    search = search.split(',').join(',<br>');
    this.formData.get('billingaddress').setValue(search)
    // console.log(search,this.formData.get('billingaddress').value);

    this.warehouseservice.create(this.formData.value).subscribe({
      next: (warehouse: any) => {
        // console.log(warehouse);
        this.toast.success('Warehouse Created Successfully');
        this.router.navigate(['/warehouse/warehouse-list']);
      },
      error: (err: any) => {
        this.toast.failure(err);
      }
    });
  }

  getstatename(event: any) {
    // console.log(event.target.value);

    let id = this.states.filter((e) => {
      if (e.name == event.target.value) return e.id;
    });
    this.formData.get('state_id').setValue(id[0].id);
   
    this.cdr.detectChanges();
  }
}
