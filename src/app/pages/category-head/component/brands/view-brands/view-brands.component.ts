import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { BrandsService } from '../../../services/brands.service';
import { Brands } from '../../../models/brands';


@Component({
  selector: 'app-view-brands',
  templateUrl: './view-brands.component.html',
  styleUrls: ['./view-brands.component.scss']
})
export class ViewBrandsComponent implements OnInit {


  @Input() selectedBrand:Brands = new Brands;
  @Output() editBrand = new EventEmitter<Brands>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams:any=[];
  deleteaction=false;
  constructor(private brandsservice: BrandsService, private modelservice: NgbModal, private toast: ToastService) { }


  ngOnInit(): void {
    this.brandsservice.findbrandassoc(this.selectedBrand.bid).subscribe({
      next:(resp: { data: string | any[]; })=>{
        if(resp.data.length==0)
        this.deleteaction = true;
      },error:(err: any)=>{
        //console.log(err);
      }
    })
  }

  editAction(brand:Brands): void{
    this.editBrand.emit(brand);
  }

  deleteParameter(brand:Brands): void{
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Brand Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';    
    modalRef.result.then((parameterResponse) => {
      this.brandsservice.delete(brand).subscribe({
        next:(resp: { status: number; message: any; }) => {
          if(resp.status==200)
          this.toast.success('Brand Deleted Successfully');
          if(resp.status==201)
          this.toast.failure(resp.message);
          this.refreshList.emit('refresh');
        },error: (err: { error: { message: any; }; })=> {
          this.toast.failure(err.error.message);
        }
      })   
    },err=>{
      //console.log(err);
    });
  }

}
