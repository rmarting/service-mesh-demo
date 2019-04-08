import { Component, OnInit } from '@angular/core';

import { InfoStatusCardConfig } from 'patternfly-ng/card';
import { CardAction, CardConfig, CardFilter, CardFilterPosition } from 'patternfly-ng/card';

import { Product } from '../model/product.model';
import { Notification, NotificationEvent } from 'patternfly-ng/notification';

import { ProductsService } from '../services/products.service';
import { NotificationsService } from '../services/notifications.service';
import { NotificationType } from 'patternfly-ng/notification';
import { GenericResult } from '../model/generic-result.model';
import { HttpRuntimeException } from '../model/http-error.model';

const data = [
  {
    itemId : '329199',
    name : 'Forge Laptop Sticker',
    description : 'JBoss Community Forge Project Sticker',
    price : 8.5,
    availability : {
      quantity : 12
    }
  }
];

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  loading = false;
  refreshStartTime = -1;
  refreshStopTime = -1;
  config: CardConfig;
  products: Product[];
  httpRuntimeException: HttpRuntimeException;

  constructor(private productsService: ProductsService, private notificationsService: NotificationsService) {
    console.log('ProductsComponent');
    this.productsService.products.subscribe(payload => {
      this.loading = false;
      this.refreshStopTime = Date.now();
      console.log('payload', payload);
      if (Array.isArray(payload)) {
        this.products = payload;
      } else {
        // Show error!
        this.httpRuntimeException = payload as HttpRuntimeException;
        this.products = [];

        this.notificationsService.notify(NotificationType.DANGER, 'Error retrieving products', this.httpRuntimeException.error);
      }
    });
  }

  getNotifications(): Notification[] {
    return this.notificationsService.notifications;
  }

  showRefreshReport() {
    return !this.loading && this.refreshStartTime > 0 && this.refreshStopTime > this.refreshStartTime;
  }

  getRefreshTime() {
    return ((this.refreshStopTime - this.refreshStartTime) / 1000).toFixed(2);
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.config = {
      noPadding: true,
      topBorder: true
    } as CardConfig;
  }

  refresh($event: any) {
    this.loading = true;
    this.refreshStartTime = Date.now();
    this.productsService.getProducts();
  }

  handleClose($event: NotificationEvent): void {
    this.notificationsService.remove($event.notification);
  }

  handleViewingChange($event: NotificationEvent): void {
    this.notificationsService.setViewing($event.notification, $event.isViewing);
  }
}
