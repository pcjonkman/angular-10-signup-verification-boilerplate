import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService, ToastService } from '@app/_services';
import { AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import { first } from 'rxjs/operators';
import { ForgotPasswordModalComponent, LoginModalComponent } from '../_modals';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./modal.scss', './register-modal.component.scss']
})
export class RegisterModalComponent implements OnInit {
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

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        title: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      });
  }

    // convenience getter for easy access to form fields
    get f() {
      return this.form.controls;
    }

    onRegister() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
        return;
      }

      this.loading = true;

      this.accountService
        .register(this.form.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Registration successful, please check your email for verification instructions', { keepAfterRouteChange: true });
            this.activeModal.close('onRegister');
            // this.router.navigate(['../login'], { relativeTo: this.route });
          },
          error: (error) => {
            this.toastService.error(error);
            this.loading = false;
          }
        });
    }

    onForgotPasswordClick() {
      this.modalService.open(ForgotPasswordModalComponent).shown.subscribe(() => { this.activeModal.close('onCloseRegisterModal'); });
    }

    onRegisterClick() {
      this.ngForm.ngSubmit.emit();
    }

    onCancelClick() {
      this.activeModal.dismiss('onCancel');
    }

    onLoginClick() {
      this.modalService.open(LoginModalComponent).shown.subscribe(() => { this.activeModal.close('onCloseRegisterModal'); });
    }

}
