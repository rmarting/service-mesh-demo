import { Component, OnInit } from '@angular/core';

import { InfoStatusCardConfig } from 'patternfly-ng/card';
import { CardAction, CardConfig, CardFilter, CardFilterPosition } from 'patternfly-ng/card';
import { Product } from '../model/product.model';
import { ProductsService } from '../services/products.service';

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

  products: Product[];

  constructor(private productsService: ProductsService) {
    console.log('ProductsComponent');
    this.productsService.products.subscribe(products => {
      console.log('products', products);
      if (products) {
        this.products = products;
      }
    });
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.config = {
      noPadding: true,
      topBorder: true
    } as CardConfig;
  }
}
