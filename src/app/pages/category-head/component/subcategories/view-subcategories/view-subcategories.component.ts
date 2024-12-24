import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Subcategories } from '../../../models/subcategories';
import { SubcategoriesService } from '../../../services/subcategories.service';

@Component({
  selector: 'app-view-subcategories',
  templateUrl: './view-subcategories.component.html',
  styleUrls: ['./view-subcategories.component.scss']
})
export class ViewSubcategoriesComponent implements OnInit {


  @Input() selectedSubcategory:Subcategories = new Subcategories;
  @Output() editSubcategory = new EventEmitter<Subcategories>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams:any=[];
  deleteaction = false;
  constructor(private subcategoriesService: SubcategoriesService, private modelservice: NgbModal, private toast: ToastService) { }


  ngOnInit(): void {
    this.subcategoriesService.findcatassoc(this.selectedSubcategory.id).subscribe({
      next:resp=>{
        if(resp.data.length==0)
        this.deleteaction = true;
      },error:err=>{
        console.log(err);
      }
    })
  }

  editAction(subcategory:Subcategories): void{
    this.editSubcategory.emit(subcategory);
  }

  deleteParameter(department:Subcategories): void{
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'SubCategory Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';    
    modalRef.result.then((parameterResponse) => {
      this.subcategoriesService.delete(department).subscribe({
        next:resp => {
          if(resp.status==200)
          this.toast.success('SubCategory Deleted Successfully');
          if(resp.status==201)
          this.toast.failure(resp.message);
          this.refreshList.emit('refresh');
        },error: err=> {
          this.toast.failure(err.error.message);
        }
      })   
    },err=>{
      console.log(err);
    });
  }

}
