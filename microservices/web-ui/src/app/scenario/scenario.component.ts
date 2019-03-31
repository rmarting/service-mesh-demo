import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CardConfig, CardAction } from 'patternfly-ng/card';
import { ScenariosService } from 'src/app/services/scenarios.service';
import { GenericResult } from '../model/generic-result.model';
import { NotificationType } from 'patternfly-ng/notification';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})
export class ScenarioComponent implements OnInit {
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
    private scenariosService: ScenariosService) {
  }

  ngOnInit() {
    this.geData();
  }

  geData(): void {
    this.title = this.route.snapshot.data.title;
    this.description = this.route.snapshot.data.description;

    if ( this.route.snapshot.data.command) {
      this.command = new ActionCard(
        this.route.snapshot.data.command.title,
        this.route.snapshot.data.command.subTitle,
        this.route.snapshot.data.command.description,
        this.route.snapshot.data.command.actionText,
        this.route.snapshot.data.command.actionUrl
      );
    } else {
      if (this.route.snapshot.data.break) {
        this.break = new ActionCard(
          this.route.snapshot.data.break.title,
          this.route.snapshot.data.break.subTitle,
          this.route.snapshot.data.break.description,
          this.route.snapshot.data.break.actionText,
          this.route.snapshot.data.break.actionUrl
        );
      }
      if (this.route.snapshot.data.fix) {
        this.fix = new ActionCard(
          this.route.snapshot.data.fix.title,
          this.route.snapshot.data.fix.subTitle,
          this.route.snapshot.data.fix.description,
          this.route.snapshot.data.fix.actionText,
          this.route.snapshot.data.fix.actionUrl
        );
      }
    }
  }

  handleNofiticationHidden($event: any): void {
    this.notificationHidden = $event;
  }

  handleActionSelect($event: CardAction): void {
    console.log($event.hypertext, $event.id);

    this.scenariosService.runAction($event.id)
      .subscribe(
        (result: GenericResult) => {
          this.actionResult = result;
          this.notificationHeader = this.actionResult.success ? 'SUCCESS' : 'ERROR';
          this.notificationMessage = this.actionResult.success ? 'Action executed successfully' : this.actionResult.description;
          this.notificationType = this.actionResult.success ? NotificationType.SUCCESS : NotificationType.DANGER;
          this.notificationHidden = false;
        },
        error => {
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
  actionText: string;
  actionUrl: string;
  constructor(
    title: string,
    subTitle: string,
    description: string,
    actionText: string,
    actionUrl: string
    ) {
      this.title = title;
      this.subTitle = subTitle;
      this.description = description;
      this.actionText = actionText;
      this.actionUrl = actionUrl;
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
