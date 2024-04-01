import {Component, TemplateRef} from '@angular/core';
import { ToastService } from '@app/_services';

@Component({
  selector: 'app-toast',
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text><i *ngIf="toast.icon" class="bi-{{toast.icon}} me-2"></i>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  host: {
    'class': 'toast-container position-fixed top-2 end-0 p-3',
    'style': 'z-index: 1200'
  }
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  isTemplate(toast: any) { return toast.textOrTpl instanceof TemplateRef; }
}
