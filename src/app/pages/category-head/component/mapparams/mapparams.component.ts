import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Product } from '../../models/product';
import { Productparameters } from '../../models/productparameters';
import { ProductsService } from '../../services/products.service';
@Component({
  selector: 'app-mapparams',
  templateUrl: './mapparams.component.html',
  styleUrls: ['./mapparams.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapparamsComponent implements OnInit {

  selproduct: Product = {};
  uuid: string = ''

  myForm!: FormGroup;

  parameters: Productparameters[] = [];

  baseurl: string = ''
  selparameterkey: any = [];
  selparameter: any = [];

  constructor(
    private route: ActivatedRoute, private router: Router,
    private productservice: ProductsService, private toast: ToastService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private env: EnvService,
    private utils: UtilsService, private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {

    this.uuid = this.route.snapshot.paramMap.get('uuid') || ''
    const productID = this.route.snapshot.paramMap.get('uuid')
    if (productID) {
      this.productservice.find(productID, {})
        .subscribe({
          next: data => {
            this.selproduct = data;
            //console.log(this.selparameter)

            if (this.selproduct.subcategory_id) {

              this.productservice.parameterlist(this.selproduct.subcategory_id).subscribe({
                next: parameters => {
                  this.parameters = parameters
                  parameters.map((val: any, i) => {
                    //this.selparameter[val.id] = '';
                    this.selparameterkey[val.id] = val.id;
                    //if(data.productmapparams[i]){
                    let selparam = data.productmapparams.find((x: any) => x.productparameter_id == val.id)
                    //console.log(selparam)

                    if (selparam)
                      this.selparameter[val.id] = selparam.value_id
                    else
                      this.selparameter[val.id] = ''
                    //}
                    //console.log(this.selparameter)
                    // this.cd.detectChanges();

                  })
                }
              })


            }
          },
          error: () => {
            this.router.navigate(['/category-head/products']);
          }
        });
    }
  }



  get f() {
    return this.myForm.controls;
  }

  submit() {
    let insertparameter: any = {}
    this.selparameterkey.forEach((val: any, index: number) => {
      insertparameter[val] = this.selparameter[index];
    })
    let formdata = { parameters: insertparameter }
    this.productservice.mappingparams(formdata, this.uuid).subscribe({
      next: resp => {
        if (resp)
          this.toast.success('Successfully Product parameters mapped');
        this.router.navigate(['/category-head/view/' + this.uuid]);
        // this.cd.detectChanges();
        //this.router.navigate(['/app/products/mapping/'+this.uuid]);
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })
  }
}
