import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';

import { BlogService } from '../../../services/blog.service';
import { Blog } from '../../../models/blog';

@Component({
  selector: 'app-viewblog',
  templateUrl: './viewblog.component.html',
  styleUrls: ['./viewblog.component.scss']
})
export class ViewblogComponent {
  @Input() data: Blog = {};

  formData!: FormGroup;
  warehouses: Blog[];
  submit: boolean = false;

  edit: boolean = false;
  constructor(
    private warehouseservice: BlogService,
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
            title: data.title,
            content: data.content,

            status: data.status,
            image: data.image
          };
          // console.log(data);
          this.ref.detectChanges();
        },
        error: (err) => {
          // console.log('error page');
          this.router.navigate(['/catalog/blogs']);
        }
      });
    } else {
      console.log('if error');
    }
  }
  back() {
    this.router.navigate(['/catalog/blogs']);
  }
}
