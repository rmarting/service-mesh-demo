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

// Components
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ProductsComponent } from './products/products.component';
import { ScenarioComponent } from './scenario/scenario.component';

// Services
import { ScenariosService } from 'src/app/services/scenarios.service';
import { ProductsService } from 'src/app/services/products.service';

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
        description: 'By executing this command action istio/default will be run and both Virtual Services and Destion Rules will be deleted',
        image: '',
        actionText: 'Execute', actionUrl: 'istio/default'
      }
    }
  },
  {
    path: 'scenario/circuit-breaker',
    component: ScenarioComponent,
    data: {
      title: 'Circtuit Breaking',
      description: 'Avoid cascading errors by applying the Cirtuit Breaker pattern',
      break: {
        title: 'Break the \'Catalog\' service',
        subTitle: '',
        description: 'This action breaks the code in one of the PODs of the catalog service, you can check the logs of the container',
        image: '',
        actionText: 'Break', actionUrl: 'istio/break-1'
      },
      fix: {
        title: 'Fix it by using a retry technic', subTitle: '',
        description: 'This fix applies a change in the catalog Virtual Service so that if there\'s a failure it retries up to 3 times',
        image: '',
        actionText: 'Fix', actionUrl: 'istio/fix-1'
      }
    }
  },
  {
    path: 'scenario/header-routing',
    component: ScenarioComponent,
    data: {
      title: 'Header Routing',
      description: 'Blah',
      command: {
        title: 'Setting routing by version header', subTitle: '',
        description: 'This command...',
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
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule
  ],
  providers: [BsDropdownConfig, ScenariosService, ProductsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
