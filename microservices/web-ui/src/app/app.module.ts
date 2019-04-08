import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// NGX Bootstrap
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Patternfly
import { ApplicationLauncherModule } from 'patternfly-ng/navigation';
import { VerticalNavigationModule } from 'patternfly-ng/navigation';
import { InfoStatusCardModule } from 'patternfly-ng/card';
import { CardModule } from 'patternfly-ng/card';
import { InlineNotificationModule } from 'patternfly-ng/notification';
import { ToastNotificationModule, ToastNotificationListModule, NotificationService } from 'patternfly-ng/notification';

// Components
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ProductsComponent } from './products/products.component';
import { ScenarioComponent } from './scenario/scenario.component';

// Services
import { ScenariosService } from 'src/app/services/scenarios.service';
import { ProductsService } from 'src/app/services/products.service';
import { NotificationsService } from 'src/app/services/notifications.service';

const appRoutes: Routes = [
  { path: 'products', component: ProductsComponent },
  {
    path: 'scenario/default',
    component: ScenarioComponent,
    data: {
      title: 'Default Scenario',
      description: 'By running this scenario you will go back to the default service mesh configuration',
      command: {
        title: 'Go back to default settings',
        subTitle: '',
        // tslint:disable-next-line:max-line-length
        description: 'By executing clicking on \'Execute\' below, action \'istio/default\' will be run and both Virtual Services \
        and Destination Rules will be deleted',
        image: 'istio-default.png',
        actionText: 'Execute', actionUrl: 'istio/default'
      }
    }
  },
  {
    path: 'scenario/circuit-breaker-1',
    component: ScenarioComponent,
    data: {
      title: 'Circuit Breaker I',
      description: 'Learn how to avoid cascading errors by applying the Cirtuit Breaker pattern',
      break: {
        title: 'Break the \'Catalog\' service',
        subTitle: '',
        // description: 'This action breaks the code in one of the PODs of the catalog service, you can check the logs of the container',
        description: 'In this scenario we\'re going to invoke a URL within the \'catalog\' service that breaks it. \
        There are 2 PODs but the \'break\' action only breaks one at random adding a delay (5s) to the response. \
        After clicking on the \'Break\' action below go to the \'products\' area and refresh several times. One out of \
        two will return in about 5s.',
        image: 'circuit-breaker-1-break.png',
        cheatSheet: [
          'curl\ -k {{ baseUrl }}/api/products'
        ],
        actionText: 'Break', actionUrl: 'istio/circuit-breaker-1-break'
      },
      fix: {
        title: 'Fix it by setting a predefined timeout', subTitle: '',
        description: 'This fix sets a timeout for requests to the \'catalog\' service of 2s \
        (https://istio.io/docs/tasks/traffic-management/request-timeouts/) in the Virtual Service. This way instead of freezing \
        for an undefined amount of time, if our request hit the broken POD the wating time will be 2s max.',
        image: 'circuit-breaker-1-fix.png',
        cheatSheet: [
          ''
        ],
        actionText: 'Fix', actionUrl: 'istio/circuit-breaker-1-fix'
      }
    }
  },
  {
    path: 'scenario/circuit-breaker-2',
    component: ScenarioComponent,
    data: {
      title: 'Circuit Breaker II',
      description: 'Learn how to avoid cascading errors by applying the Cirtuit Breaker pattern',
      break: {
        title: 'Break the \'Inventory\' service',
        subTitle: '',
        description: 'In this scenario we\'re going to invoke a URL within the <strong>\'inventory\' service</strong> that breaks it. \
        There are 2 PODs but the <strong>\'break\'</strong> action only breaks one at random generating an exception 5xx everytime \
        <strong>/api/inventory/id</strong> is\'s invoked. \
        After clicking on the \'Break\' action below go to the \'products\' area and refresh several times. You\'ll see \
        how half the products have <strong>quantity \'-1\'</strong>.',
        image: 'circuit-breaker-2-break.png',
        cheatSheet: [
          'You can also use: curl\ -k {{ baseUrl }}/api/products'
        ],
        actionText: 'Break', actionUrl: 'istio/circuit-breaker-2-break'
      },
      fix: {
        title: 'Fix it by using an outlier traffic policy', subTitle: '',
        description: 'This fix uses the Cirtuit Breaker pattern by applying an outlier detection policy. After applying the \
        fix, go back to the \'products\' area and refresh, after refreshing a couple of times you should see no errors. You can \
        always look at the \'envoy\' stats.',
        image: 'circuit-breaker-2-fix.png',
        cheatSheet: [
          'export INVENTORY_POD=$(oc get pod -n coolstore | grep inventory | grep Running | awk \'NR == 1 {print $1}\')',
          'oc exec $GW_POD -c istio-proxy -n coolstore curl http://localhost:15000/stats | grep ejection'
        ],
        actionText: 'Fix', actionUrl: 'istio/circuit-breaker-2-fix'
      }
    }
  },
  {
    path: 'scenario/fault-injection',
    component: ScenarioComponent,
    data: {
      title: 'Fault Injection',
      description: 'Avoid cascading errors by applying the Cirtuit Breaker pattern',
      break: {
        title: 'Break the \'Catalog\' service',
        subTitle: '',
        // description: 'This action breaks the code in one of the PODs of the catalog service, you can check the logs of the container',
        description: 'In this scenario we\'re going to create a Virtual \
        This action injects HTTP 5xx errors when a certain header is received by the Virtual Service',
        image: 'circuit-breaker-break.png',
        actionText: 'Break', actionUrl: 'istio/circuit-breaker-break'
      },
      fix: {
        title: 'Fix it by using a retry technic', subTitle: '',
        description: 'This fix applies a change in the catalog Virtual Service so that if there\'s a failure it retries up to 3 times',
        image: '',
        actionText: 'Fix', actionUrl: 'istio/circuit-breaker-fix'
      }
    }
  },
  {
    path: 'scenario/header-routing',
    component: ScenarioComponent,
    data: {
      title: 'Header Routing',
      description: 'Route traffic to one or another destionation using an HTTP header',
      command: {
        title: 'Setting routing by version header \'msa-version\' ', subTitle: '',
        description: 'When you click \'Execute\' below, \'version 2.0.0\' of the \'inventory\' service will be scaled up to 1 POD, \
        the virtual service and the destination rule for the mentioned service will be updated to: 1) define a new destionation for \
        the new version and 2) a routing rule is defined in the virtual service so that only if header \'msa-version\' is \'v2\' traffic \
        will be routed to \'inventory-v2\'.',
        image: 'header-routing.png',
        actionText: 'Execute', actionUrl: 'istio/header-routing'
      }
    }
  },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '',
  //   redirectTo: '/heroes',
  //   pathMatch: 'full'
  // },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ProductsComponent,
    ScenarioComponent
  ],
  imports: [
    ApplicationLauncherModule,
    VerticalNavigationModule,
    InfoStatusCardModule,
    CardModule,
    InlineNotificationModule,
    ToastNotificationModule,
    ToastNotificationListModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule
  ],
  providers: [BsDropdownConfig, ScenariosService, ProductsService, NotificationService, NotificationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
