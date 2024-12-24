import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Testimonials } from '../../../models/testimonials';
import { TestimonialsService } from '../../../services/testimonials.service';

@Component({
  selector: 'app-view-testimonials',
  templateUrl: './view-testimonials.component.html',
  styleUrls: ['./view-testimonials.component.scss']
})
export class ViewTestimonialsComponent {
  @Input() data: Testimonials = {};

  formData!: FormGroup;
  warehouses: Testimonials[];
  submit: boolean = false;

  edit: boolean = false;
  constructor(
    private warehouseservice: TestimonialsService,
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
            content: data.content,

            status: data.status,
            image: data.image
          };
          // console.log(data);
          this.ref.detectChanges();
        },
        error: (err) => {
          // console.log('error page');
          this.router.navigate(['/catalog/testimonials']);
        }
      });
    } else {
      console.log('if error');
    }
  }
  back() {
    this.router.navigate(['/catalog/testimonials']);
  }
}
