import { Component, OnInit } from '@angular/core';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    account = this.accountService.accountValue;

    constructor(private accountService: AccountService) { }

    ngOnInit(): void {
      this.accountService.account.subscribe(x => this.account = x);
    }
}
