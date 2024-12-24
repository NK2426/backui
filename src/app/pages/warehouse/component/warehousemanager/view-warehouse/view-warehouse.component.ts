import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Warehouse } from '../../../models/warehouse';
import { WarehouseManagerService } from '../../../services/warehousemanager.service';

@Component({
  selector: 'app-view-warehouse',
  templateUrl: './view-warehouse.component.html',
  styleUrls: ['./view-warehouse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewWarehouseComponent {
  @Input() data: Warehouse = {};

  formData!: FormGroup;
  warehouses: Warehouse[];
  submit: boolean = false;

  edit: boolean = false;

  constructor(
    private warehouseservice: WarehouseManagerService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.warehouseservice.view(id).subscribe({
        next: (data) => {
          this.data = {
            name: data.name,
            address: data.address,
            address1: data.address1,
            address2: data.address2,
            mobile: data.mobile,
            billingaddress: data.billingaddress.split('<br>').join(''),
            status: data.status,
            gstin:data.gstin
          };
          // console.log(data);
          this.ref.detectChanges();
        },
        error: (err) => {
          console.log('error page');
          this.router.navigate(['/warehouse/warehouse-list']);
        }
      });
    } else {
      console.log('if error');
      // this.router.navigate(['/hr/view/']);
    }
  }
  back(){
    this.router.navigate(['/warehouse/warehouse-list'])
  }
}
