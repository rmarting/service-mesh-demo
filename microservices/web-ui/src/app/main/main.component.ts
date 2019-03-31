import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';

import { VerticalNavigationItem } from 'patternfly-ng/navigation/vertical-navigation/vertical-navigation-item';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-main',
  styleUrls: ['./main.component.css'],
  /*styles: [`
    .faux-layout {
      position: fixed;
      top: 37px;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #f5f5f5;
      padding-top: 15px;
      z-index: 1100;
    }
    .example-page-container.container-fluid {
      position: fixed;
      top: 37px;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #f5f5f5;
      padding-top: 15px;
    }

    .hide-vertical-nav {
      margin-top: 15px;
      margin-left: 30px;
    }

    .navbar-brand-txt {
      line-height: 34px;
    }
  `],*/
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  // tslint:disable-next-line:no-inferrable-types
  showExample: boolean = false;
  navigationItems: VerticalNavigationItem[];
  // tslint:disable-next-line:no-inferrable-types
  actionText: string = '';

  constructor(private chRef: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit(): void {
    this.navigationItems = [
      {
        title: 'Products',
        iconStyleClass: 'fa fa-shopping-bag',
        url: '/products'
      },
      /*{
        title: 'Dolor',
        iconStyleClass: 'fa fa-shield',
        url: '/verticalnavigation/dolor',
        badges: [
          {
            count: 1283,
            tooltip: 'Total number of items'
          }
        ]
      },*/
      {
        title: 'Istio',
        iconStyleClass: 'fa fa-space-shuttle',
        children: [
          {
            title: 'Reset (default)',
            url: '/scenario/default'
          },
          {
            title: 'Header Routing',
            url: '/scenario/header-routing'
          },
          {
            title: 'Circuit Breaker',
            url: '/scenario/circuit-breaker'
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
