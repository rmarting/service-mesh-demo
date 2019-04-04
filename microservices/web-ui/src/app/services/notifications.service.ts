import { Injectable, OnInit } from '@angular/core';

import { Notification, NotificationService } from 'patternfly-ng/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notifications: Notification[];

  constructor(private notificationService: NotificationService) {
    console.log('NotificationsService constructor');
    this.notificationService.setDelay(2000);
    this.notifications = this.notificationService.getNotifications();
  }

  notify(type: string, header: string, message: string): void {
    console.log('notify', type, header, message);
    console.log('this.notifications.length', this.notifications.length);
    this.notificationService.message(type, header, message, false, null, null);
  }

  remove(notification: Notification): void {
    this.notificationService.remove(notification);
  }

  setViewing(notification: Notification, isViewing: boolean) {
    this.notificationService.setViewing(notification, isViewing);
    if (!isViewing) {
      this.remove(notification);
    }
  }
}
