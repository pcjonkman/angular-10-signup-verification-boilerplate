import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Alert, AlertType } from '@app/_models';
import { AlertService } from '@app/_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription = new Subscription();
  routeSubscription: Subscription = new Subscription();

  constructor(private router: Router, private alertService: AlertService) { }

  ngOnInit() {
      // subscribe to new alert notifications
      this.alertSubscription = this.alertService.onAlert(this.id)
          .subscribe(alert => {
              // clear alerts when an empty alert is received
              if (!alert.message) {
                  // filter out alerts without 'keepAfterRouteChange' flag
                  this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

                  // remove 'keepAfterRouteChange' flag on the rest
                  this.alerts.forEach(x => delete x.keepAfterRouteChange);
                  return;
              }

              // add alert to array
              this.alerts.push(alert);

              // auto close alert if required
              if (alert.autoClose) {
                setTimeout(() => this.removeAlert(alert), 5000);
              }
         });

      // clear alerts on location change
      this.routeSubscription = this.router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
              this.alertService.clear(this.id);
          }
      });
  }

  ngOnDestroy() {
      // unsubscribe to avoid memory leaks
      this.alertSubscription.unsubscribe();
      this.routeSubscription.unsubscribe();
  }

  getType(alert: Alert) {
    return AlertType[alert.type.toString() as keyof typeof AlertType].toString().toLowerCase();
  }

  removeAlert(alert: Alert) {
      // check if already removed to prevent error on auto close
      if (!this.alerts.includes(alert)) return;

      if (this.fade) {
          // fade out alert
          alert.fade = true;

          // remove alert after faded out
          setTimeout(() => {
              this.alerts = this.alerts.filter(x => x !== alert);
          }, 250);
      } else {
          // remove alert
          this.alerts = this.alerts.filter(x => x !== alert);
      }
  }

  cssClasses(alert: Alert) {
      if (!alert) return '';

      const classes = ['alert', 'alert-dismissable'];

      const alertTypeClass = {
          [AlertType.Success]: 'alert alert-success',
          [AlertType.Danger]: 'alert alert-danger',
          [AlertType.Info]: 'alert alert-info',
          [AlertType.Warning]: 'alert alert-warning'
      }

      classes.push(alertTypeClass[alert.type]);

      if (alert.fade) {
          classes.push('fade');
      }

      return classes.join(' ');
  }
}
