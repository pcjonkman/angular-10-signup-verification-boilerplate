import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from './account/_modals';
import { AccountService, ToastService } from './_services';
import { Account, Role } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  Role = Role;
  account: Account;

  constructor(
    private accountService: AccountService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.accountService.account.subscribe(x => this.account = x);
  }

  logout(): void {
    this.accountService.logout();
    this.toastService.success('Logout successful');
  }

  login(): void {
    this.modalService.open(LoginModalComponent);
  }
}
