import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Categories } from '../../../models/categories';
import { CategoriesService } from '../../../services/categories.service';

@Component({
  selector: 'app-view-categories',
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.scss']
})
export class ViewCategoriesComponent implements OnInit {


  @Input() selectedCategory:Categories = new Categories;
  @Output() editCategory = new EventEmitter<Categories>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams:any=[];
  deleteaction = false;
  constructor(private categoriesservice: CategoriesService, private modelservice: NgbModal, private toast: ToastService) { }


  ngOnInit(): void {
    this.categoriesservice.findcatassoc(this.selectedCategory.cid).subscribe({
      next:resp=>{
        if(resp.data.length==0)
        this.deleteaction = true;
      },error:err=>{
        console.log(err);
      }
    })
  }

  editAction(category:Categories): void{
    this.editCategory.emit(category);
  }

  deleteParameter(category:Categories): void{
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Category Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';    
    modalRef.result.then((parameterResponse) => {
      this.categoriesservice.delete(category).subscribe({
        next:resp => {
          if(resp.status==200)
          this.toast.success('Category Deleted Successfully');
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
