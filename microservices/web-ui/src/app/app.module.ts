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
import { ScenarioCardComponent } from './scenario-card/scenario-card.component';

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
        description: 'In this scenario <strong>we\'re going to invoke a URL within the <code>\'catalog\'</code> service to \
        breaks it.</strong>  \
        There are <strong>2 PODs</strong> but <strong>the \'Break\' action only breaks only one</strong> (at random), \
        <strong>adding a delay (5s) to the response</strong>. \
        <em>After clicking on the <code>\'Break\'</code> action below go to the <code>\'products\'</code> area and refresh \
        several times. <strong>One out of two will return in about 5s</strong></em>.',
        image: 'circuit-breaker-1-break.png',
        cheatSheet: [
          'time curl\ -k {{ baseUrl }}/api/products'
        ],
        actionText: 'Break', actionUrl: 'istio/circuit-breaker-1-break'
      },
      fix: {
        title: 'Fix it by setting a predefined timeout', subTitle: '',
        description: '<strong>This fix sets a <a href="https://istio.io/docs/tasks/traffic-management/request-timeouts/">timeout</a>\
        </strong> for requests to the \'catalog\' service <strong>of 2s</strong> \
        in the <code>\'catalog\'</code> <strong>Virtual Service</strong>. <strong>This way</strong> instead of freezing \
        for an undefined amount of time, if our request hit the broken POD <strong>the wating time will be 2s max</strong>.',
        image: 'circuit-breaker-1-fix.png',
        cheatSheet: [
          'time curl\ -k {{ baseUrl }}/api/products'
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
        description: 'In this scenario <strong>we\'re going to invoke a URL within the <code>\'inventory\'</code> service to \
        breaks it.</strong> \
        There are <strong>2 PODs</strong> but <strong>the <code>\'Break\'</code> action only breaks only one</strong> (at random), \
        <strong>generating an exception 5xx everytime <code>/api/inventory/id</code> is\'s invoked</strong>.<br> \
        <em>After clicking on the <code>\'Break\'</code> action below go to the \'products\' area and refresh several times</em>. \
        <em>You\'ll see how half the products have <strong>quantity = \'-1\'</strong></em>.',
        image: 'circuit-breaker-2-break.png',
        cheatSheet: [
          '$ curl\ -k {{ baseUrl }}/api/products'
        ],
        actionText: 'Break', actionUrl: 'istio/circuit-breaker-2-break'
      },
      fix: {
        title: 'Fix it by using an outlier traffic policy', subTitle: '',
        description: 'This fix uses the <strong>Cirtuit Breaker</strong> pattern by applying an <strong>outlier detection \
        policy</strong>.<br> \
        <em>After applying the fix, go back to the <code>\'products\'</code> area and refresh, after refreshing \
        a couple of times you should see no errors. You can always look at the <code>\'envoy\'</code> stats (see Cheat Sheet)</em>.',
        image: 'circuit-breaker-2-fix.png',
        cheatSheet: [
          '$ export INVENTORY_POD=$(oc get pod -n coolstore | grep inventory | grep Running | awk \'NR == 1 {print $1}\')',
          '$ oc exec $INVENTORY_POD_POD -c istio-proxy -n coolstore curl http://localhost:15000/stats | grep ejection'
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
        description: '<strong>When you click \'Execute\'</strong> below, <strong>\'version 2.0.0\'</strong> of the \
        <strong>\'inventory\'</strong> service <strong>will be scaled up to 1 POD</strong>, \
        the <strong>virtual service and the destination rule</strong> for the mentioned service will be updated to: \
        <ol><li>To define a <strong>new destination for the new version</strong></li> \
        <li>To define a <strong>routing rule in the virtual service</strong> so that only <strong>if header \'msa-version\' \
        is \'v2\'</strong> traffic will be <strong>routed to \'inventory-v2\'</strong> and you\'ll see \
        <strong>"discount" : 0.2</strong></li>\
        <ol>',
        image: 'header-routing.png',
        cheatSheet: [
          '$ curl\ -k -H \'msa-version: v1\' {{ baseUrl }}/api/products\n  ...\n     "quantity" : 53\n   }\n }\n]',
          '$ curl\ -k -H \'msa-version: v2\' {{ baseUrl }}/api/products\n  ...\n     "quantity" : 53\n   },\n   "discount" : 0.2\n }\n]'
        ],
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
    ScenarioComponent,
    ScenarioCardComponent
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
