import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '@app/_services';
import { AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ForgotPasswordModalComponent } from '../_modals';

enum EmailStatus {
  Verifying,
  Failed
}

@Component({
  selector: 'app-verifyemail-modal',
  templateUrl: './verifyemail-modal.component.html',
  styleUrls: ['./modal.scss', './verifyemail-modal.component.scss']
})

export class VerifyEmailModalComponent implements OnInit {
  @ViewChild('modalForm') ngForm!: NgForm;
  EmailStatus = EmailStatus;
  emailStatus = EmailStatus.Verifying;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
        const token = this.route.snapshot.queryParams['token'];

        this.accountService.verifyEmail(token)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Verification successful, you can now login');
                    this.activeModal.close("onVerifyEmail");
                },
                error: () => {
                    this.emailStatus = EmailStatus.Failed;
                }
            });
  }

  onForgotPasswordClick() {
    this.modalService.open(ForgotPasswordModalComponent).shown.subscribe(() => { this.activeModal.close('onCloseVerifyEmailModal'); });
  }

  onCancelClick() {
    this.activeModal.dismiss('onCancel');
  }
}
