import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Store } from '../../../models/store';
import { StoreManagerService } from '../../../services/store.service';


@Component({
  selector: 'app-viewstore',
  templateUrl: './viewstore.component.html',
  styleUrls: ['./viewstore.component.scss']
})
export class ViewstoreComponent {
  @Input() data: Store = {};

  formData!: FormGroup;
  warehouses: Store[];
  submit: boolean = false;

  edit: boolean = false;
  constructor(
    private warehouseservice: StoreManagerService,
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
            map: data.map,
            status: data.status,
            image:data.image,
            state_image:data.state_image
           
          };
          // console.log(data);
          this.ref.detectChanges();
        },
        error: (err) => {
          // console.log('error page');
          this.router.navigate(['/catalog/stores']);
        }
      });
    } else {
      console.log('if error');
     
    }
  }
  back(){
    this.router.navigate(['/catalog/stores'])
  }
}
