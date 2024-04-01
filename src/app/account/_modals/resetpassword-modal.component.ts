import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService, ToastService } from '@app/_services';
import { AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { MustMatch } from '@app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { ForgotPasswordModalComponent } from '../_modals';

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

@Component({
  selector: 'app-resetpassword-modal',
  templateUrl: './resetpassword-modal.component.html',
  styleUrls: ['./modal.scss', './resetpassword-modal.component.scss']
})

export class ResetPasswordModalComponent implements OnInit {
  @ViewChild('modalForm') ngForm!: NgForm;
  @ViewChild('passwordField') passwordField: ElementRef;
  form!: FormGroup;
  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  token = null;
  loading = false;
  submitted = false;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private alertService: AlertService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
        this.form = this.formBuilder.group({
            password: [{value: '', disabled: true}, [Validators.required, Validators.minLength(6)]],
            confirmPassword: [{value: '', disabled: true}, Validators.required],
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });

        const token = this.route.snapshot.queryParams['token'];

        this.accountService.validateResetToken(token)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.token = token;
                    this.tokenStatus = TokenStatus.Valid;
                    this.form.controls.password.enable();
                    this.form.controls.confirmPassword.enable();
                    this.passwordField.nativeElement.focus();
                },
                error: () => {
                    this.tokenStatus = TokenStatus.Invalid;
                }
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
    this.accountService.resetPassword(this.token, this.f.password.value, this.f.confirmPassword.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
                this.activeModal.close("onResetPassword");
            },
            error: error => {
                this.toastService.error(error);
                this.loading = false;
            }
        });
  }

  onForgotPasswordClick() {
    this.modalService.open(ForgotPasswordModalComponent).shown.subscribe(() => { this.activeModal.close('onCloseResetPasswordModal'); });
  }

  onCancelClick() {
    this.activeModal.dismiss('onCancel');
  }
}
