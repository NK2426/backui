import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Tax } from '../../../models/purchaseorder';
import { TaxService } from '../../../services/tax.service';


@Component({
  selector: 'app-viewtax',
  templateUrl: './viewtax.component.html',
  styleUrls: ['./viewtax.component.scss']
})
export class ViewtaxComponent implements OnInit {

  @Input() selectedTax:Tax = new Tax;
  @Output() edittax = new EventEmitter<Tax>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams:any=[];
  deleteaction=false;
  constructor(private taxservice: TaxService, private modelservice: NgbModal, private toast: ToastService) { }


  ngOnInit(): void {
    this.taxservice.find(this.selectedTax.id).subscribe({
      next:resp=>{
        if(resp.data.length==0)
        this.deleteaction = true;
      },error:err=>{
        console.log(err);
      }
    })
  }

  editAction(tax:Tax): void{
    this.edittax.emit(tax);
  }

  deleteParameter(tax:Tax): void{
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Tax Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';    
    modalRef.result.then((parameterResponse) => {
      this.taxservice.delete(tax).subscribe({
        next:resp => {
          if(resp.status==200)
          this.toast.success('Tax Deleted Successfully');
          if(resp.status==201)
          this.toast.failure(resp.message);
          this.refreshList.emit('refresh');
        },error: err=> {
          this.toast.failure(err);
        }
      })   
    },err=>{
      console.log(err);
    });
  }

}
