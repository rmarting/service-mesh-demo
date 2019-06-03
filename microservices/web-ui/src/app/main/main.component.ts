import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';

import { VerticalNavigationItem } from 'patternfly-ng/navigation/vertical-navigation/vertical-navigation-item';

import { Notification } from 'patternfly-ng/notification';
import { NotificationsService } from '../services/notifications.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-main',
  styleUrls: ['./main.component.css'],
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  // tslint:disable-next-line:no-inferrable-types
  showExample: boolean = false;
  navigationItems: VerticalNavigationItem[];
  // tslint:disable-next-line:no-inferrable-types
  actionText: string = '';

  constructor(
    private chRef: ChangeDetectorRef,
    private router: Router,
    private nofiticationsService: NotificationsService) {
  }

  getNotifications(): Notification[] {
    return this.nofiticationsService.notifications;
  }

  ngOnInit(): void {
    this.navigationItems = [
      {
        title: 'Products',
        iconStyleClass: 'fa fa-shopping-bag',
        url: '/products'
      },
      {
        title: 'Istio',
        iconStyleClass: 'fa fa-space-shuttle',
        children: [
          {
            title: 'Reset (default)',
            url: '/scenario/default',
            /* badges: [
              {
                count: 6,
                tooltip: 'Total number of error items',
                iconStyleClass: 'pficon pficon-error-circle-o'
              }
            ]*/
          },
          {
            title: 'Header Routing',
            url: '/scenario/header-routing'
          },
          {
            title: 'Circuit Breaker I',
            url: '/scenario/circuit-breaker-1'
          },
          {
            title: 'Circuit Breaker II',
            url: '/scenario/circuit-breaker-2'
          }
        ]
      },
      {
        title: 'Dashboard',
        iconStyleClass: 'fa fa-dashboard',
        url: '/dashboard'
      }
    ];
  }

  toggleExample(): void {
    this.showExample = !this.showExample;
    this.chRef.detectChanges();
  }

  onItemClicked($event: VerticalNavigationItem): void {
    this.actionText += 'Item Clicked: ' + $event.title + '\n';
  }

  onNavigation($event: VerticalNavigationItem): void {
    this.actionText += 'Navigation event fired: ' + $event.title + '\n';
  }
}
