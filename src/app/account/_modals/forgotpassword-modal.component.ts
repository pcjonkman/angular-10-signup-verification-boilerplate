import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService, ToastService } from '@app/_services';
import { AlertService } from '@app/_services';
import { finalize, first } from 'rxjs/operators';
import { LoginModalComponent } from '../_modals';

@Component({
  selector: 'app-forgotpassword-modal',
  templateUrl: './forgotpassword-modal.component.html',
  styleUrls: ['./modal.scss', './forgotpassword-modal.component.scss']
})

export class ForgotPasswordModalComponent implements OnInit {
  @ViewChild('modalForm') ngForm!: NgForm;
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
      this.form = this.formBuilder.group({
          email: ['', [Validators.required, Validators.email]]
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.loading = true;
      this.alertService.clear();
      this.accountService.forgotPassword(this.f.email.value)
          .pipe(first())
          .pipe(finalize(() => this.loading = false))
          .subscribe({
              next: () => {
                this.alertService.success('Please check your email for password reset instructions');
                this.activeModal.close("onForgetPassword");
              },
              error: (error) => {
                this.toastService.error(error);
              }
          });
  }

  onCancelClick() {
    this.activeModal.dismiss('onCancel');
  }

  onLoginClick() {
    this.modalService.open(LoginModalComponent).shown.subscribe(() => { this.activeModal.close('onCloseForgotPasswordModal'); });
  }
}
