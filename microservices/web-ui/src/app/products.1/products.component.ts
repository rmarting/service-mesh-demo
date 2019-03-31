import { Component, OnInit } from '@angular/core';

import { InfoStatusCardConfig } from 'patternfly-ng/card';
import { CardAction, CardConfig, CardFilter, CardFilterPosition } from 'patternfly-ng/card';

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
  config: CardConfig;

  card1Config: InfoStatusCardConfig = {
    showTopBorder: true,
    htmlContent: true,
    title: 'TinyCore-local',
    href: '//www.redhat.com/',
    iconStyleClass: 'fa fa-shield',
    info: [
      'VM Name: aapdemo002',
      'Host Name: localhost.localdomian',
      'IP Address: 10.9.62.100',
      'Power status: on'
    ]
  };

  card2Config: InfoStatusCardConfig = {
    showTopBorder: false,
    htmlContent: false,
    // iconImageSrc: '//www.patternfly.org/assets/img/patternfly-orb.svg',
    // tslint:disable-next-line:max-line-length
    iconImageSrc: 'http://istio-ingressgateway-istio-system.apps.serverless-d68e.openshiftworkshop.com/app/imgs/Forge%20Laptop%20Sticker.jpg',
    info: [
      'Infastructure: VMware',
      'Vmware: 1 CPU (1 socket x 1 core), 1024 MB',
      '12 Snapshots',
      'Drift History: 1',
      '<b>No htmlContent</b>'
    ]

  };

  card3Config: InfoStatusCardConfig = {
    htmlContent: true,
    title: 'Favorite Things',
    iconStyleClass: 'fa fa-heart',
    info: [
      '<i class="fa fa-coffee">',
      '<i class="fa fa-motorcycle">',
      '<b>Tacos</b>'
    ]
  };

  constructor() { }

  ngOnInit() {
    this.config = {
      noPadding: true,
      topBorder: true
    } as CardConfig;
  }

}
