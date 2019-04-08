import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Config } from '../model/config.model';
import { CardAction } from 'patternfly-ng/card';

@Component({
  selector: 'app-scenario-card',
  templateUrl: './scenario-card.component.html',
  styleUrls: ['./scenario-card.component.css']
})
export class ScenarioCardComponent implements OnInit {
  @Input() image: string;
  @Input() description: string;
  @Input() cheatSheet: string[];
  @Input() config: Config;
  @Output() actionSelect = new EventEmitter<CardAction>();

  activeTab = 'diagram';

  constructor() { }

  ngOnInit() {
  }

  handleActionSelect($event: CardAction): void {
    console.log('handleActionSelect', $event);
    this.actionSelect.emit($event);
  }

  setActiveTab(activeTab: string) {
    this.activeTab = activeTab;
  }
}
