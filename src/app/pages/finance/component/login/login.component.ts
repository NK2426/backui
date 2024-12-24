import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ToastService } from 'src/app/helpers/toast/toast.service';
import { TokenStorageService } from '../../services/token-storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted = false;
  error = '';
  returnUrl!: string;

  year: number = new Date().getFullYear();

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private auth: AuthService, private storage: TokenStorageService, private router: Router, private toast: ToastService, private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    document.body.style.background = '#112778';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
  * Login submit
  */
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {

      this.toast.loadingterm = true;
      const { username, password } = this.loginForm.value;

      this.auth.login(username, password)
        .subscribe({
          next: data => {
            document.body.style.background = '';

            this.toast.loadingterm = false;
            this.storage.saveToken(data.accessToken);
            this.storage.saveUser(data);
            this.auth.checkLogin();
            this.router.navigate(['/app']);
            this.cd.detectChanges();
          },
          error: err => {
            this.toast.loadingterm = false;
            this.error = err?.error?.message;
          }
        });
    }
  }
}
