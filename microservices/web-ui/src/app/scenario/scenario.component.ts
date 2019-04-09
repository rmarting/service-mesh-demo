import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ScenariosService } from 'src/app/services/scenarios.service';
import { ConfigService } from '../services/config.service';

import { CardConfig, CardAction } from 'patternfly-ng/card';
import { GenericResult } from '../model/generic-result.model';
import { NotificationType } from 'patternfly-ng/notification';
import { Config } from '../model/config.model';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})
export class ScenarioComponent implements OnInit {
  config: Config;
  baseUrl: string;
  loading = false;

  activeTab = 'diagram';

  scenariosServiceReady: boolean;

  title: string;
  description: string;

  command: ActionCard;
  break: ActionCard;
  fix: ActionCard;

  actionResult: GenericResult;

  notificationHeader = 'Default Header.';
  notificationMessage = 'Default Message.';
  notificationType: NotificationType = NotificationType.SUCCESS;
  notificationHidden = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private scenariosService: ScenariosService) {
      console.log('ScenarioComponent constructor');
      this.configService.config.subscribe(config => {
        console.log('config', config);
        if (config) {
          this.config = config;
          this.baseUrl = this.config.API_ENDPOINT;
        }
      });

      this.scenariosService.ready.subscribe(ready => {
        console.log('scenariosServiceReady', ready);
        if (ready) {
          this.scenariosServiceReady = ready;
        }
      });
  }

  ngOnInit() {
    this.getData();
  }

  notificationIconClass() {
    if (this.loading) {
      return 'pficon spinner';
    }

    if (this.actionResult) {
      if (this.actionResult.success) {
        return 'pficon pficon-ok';
      } else {
        return 'pficon pficon-error-circle-o';
      }
    }

    return 'pficon pficon-info';
  }

  notificationClass() {
    if (this.loading) {
      return 'alert alert-info';
    }

    if (this.actionResult) {
      if (this.actionResult.success) {
        return 'alert alert-success';
      } else {
        return 'alert alert-danger';
      }
    }

    return 'alert alert-info';
  }

  getData(): void {
    this.title = this.route.snapshot.data.title;
    this.description = this.route.snapshot.data.description;

    if ( this.route.snapshot.data.command) {
      this.command = new ActionCard(
        this.route.snapshot.data.command.title,
        this.route.snapshot.data.command.subTitle,
        this.processLine(this.route.snapshot.data.command.description),
        this.route.snapshot.data.command.image,
        this.route.snapshot.data.command.actionText,
        this.route.snapshot.data.command.actionUrl,
        this.processLines(this.route.snapshot.data.command.cheatSheet)
      );
    } else {
      if (this.route.snapshot.data.break) {
        this.break = new ActionCard(
          this.route.snapshot.data.break.title,
          this.route.snapshot.data.break.subTitle,
          this.processLine(this.route.snapshot.data.break.description),
          this.route.snapshot.data.break.image,
          this.route.snapshot.data.break.actionText,
          this.route.snapshot.data.break.actionUrl,
          this.processLines(this.route.snapshot.data.break.cheatSheet)
        );
      }
      if (this.route.snapshot.data.fix) {
        this.fix = new ActionCard(
          this.route.snapshot.data.fix.title,
          this.route.snapshot.data.fix.subTitle,
          this.processLine(this.route.snapshot.data.fix.description),
          this.route.snapshot.data.fix.image,
          this.route.snapshot.data.fix.actionText,
          this.route.snapshot.data.fix.actionUrl,
          this.processLines(this.route.snapshot.data.fix.cheatSheet)
        );
      }
    }
  }

  setActiveTab(activeTab: string) {
    this.activeTab = activeTab;
  }

  handleNofiticationHidden($event: any): void {
    this.notificationHidden = $event;
  }

  processLines(lines: string[]) {
    if (lines) {
      return lines.map(line => this.processLine(line));
    }
    return null;
  }

  processLine(description: string) {
    const re = /{{\s*baseUrl\s*}}/gi;
    return description.replace(re, this.baseUrl);
  }

  handleActionSelect($event: CardAction): void {
    console.log('scenario.handleActionSelect', $event.hypertext, $event.id);

    if (!this.scenariosServiceReady) {
      alert('WAIT!!!');
      return;
    }

    this.loading = true;
    this.scenariosService.runAction($event.id)
      .subscribe(
        (result: GenericResult) => {
          this.loading = false;
          this.actionResult = result;

          this.notificationHeader = this.actionResult.success ? 'SUCCESS' : 'ERROR';
          this.notificationMessage = this.actionResult.success ? 'Action executed successfully' : this.actionResult.error.message;
          this.notificationType = this.actionResult.success ? NotificationType.SUCCESS : NotificationType.DANGER;
          this.notificationHidden = false;
        },
        error => {
          this.loading = false;
          this.actionResult = { success: false, description: error.message } as GenericResult;
          this.notificationHeader = 'ERROR';
          this.notificationMessage = this.actionResult.description;
          this.notificationType = NotificationType.DANGER;
          this.notificationHidden = false;
        }
      );
  }
}

class ActionCard {
  config: CardConfig;
  title: string;
  subTitle: string;
  description: string;
  image: string;
  actionText: string;
  actionUrl: string;
  cheatSheet: string[];
  constructor(
    title: string,
    subTitle: string,
    description: string,
    image: string,
    actionText: string,
    actionUrl: string,
    cheatSheet: string[]
    ) {
      this.title = title;
      this.subTitle = subTitle;
      this.description = description;
      this.image = image;
      this.actionText = actionText;
      this.actionUrl = actionUrl;
      this.cheatSheet = cheatSheet;
      this.config = {
        action: {
          id: actionUrl,
          hypertext: actionText,
          iconStyleClass: 'fa fa-flag',
        },
        title,
        subTitle
      } as CardConfig;
  }
}
