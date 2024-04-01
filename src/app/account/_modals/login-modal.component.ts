import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService, ToastService } from '@app/_services';
import { AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { ForgotPasswordModalComponent, RegisterModalComponent } from '../_modals';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./modal.scss', './login-modal.component.scss']
})

export class LoginModalComponent implements OnInit {
  @ViewChild('modalForm') ngForm!: NgForm;
  form!: FormGroup;
  loading = false;
  submitted = false;
  closeResult = '';

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

    // convenience getter for easy access to form fields
    get f() {
      return this.form.controls;
    }

    onLogin() {
      console.log('onlogin')
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
        return;
      }

      this.loading = true;

      this.accountService
        .login(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Login successful');
            this.activeModal.close("onLogin");
          },
          error: (error) => {
            this.toastService.error(error);
            this.loading = false;
          }
        });
    }

    onForgotPasswordClick() {
      this.modalService.open(ForgotPasswordModalComponent).shown.subscribe(() => { this.activeModal.close('onCloseLoginModal'); });
    }

    onRegisterClick() {
      this.modalService.open(RegisterModalComponent).shown.subscribe(() => { this.activeModal.close('onCloseLoginModal'); });
    }

    onCancelClick() {
      this.activeModal.dismiss('onCancel');
    }

    onLoginClick() {
      this.ngForm.ngSubmit.emit();
    }
}
