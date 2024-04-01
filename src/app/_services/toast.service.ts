import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  info(message: string) {
    this.show(message, { classname: 'fs-6', icon: 'info-square' });
  }

  success(message: string) {
    this.show(message, { classname: 'bg-success text-light fs-6', icon: 'check-lg' });
  }

  error(message: string) {
    this.show(message, { classname: 'bg-danger text-light fs-6', icon: 'x-octagon' });
  }

  warning(message: string) {
    this.show(message, { classname: 'bg-warning text-dark fs-6', icon: 'exclamation-triangle' });
  }

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
