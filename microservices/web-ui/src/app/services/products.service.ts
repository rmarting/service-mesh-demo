import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/product.model';
import { ConfigService } from './config.service';
import { Config } from '../model/config.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // tslint:disable-next-line:variable-name
  // private _ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // public readonly ready: Observable<boolean> = this._ready.asObservable();

  // tslint:disable-next-line:variable-name
  private _products: BehaviorSubject<Product[]> = new BehaviorSubject([]);
  public readonly products: Observable<Product[]> = this._products.asObservable();

  config: Config;
  baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    console.log('ProductsService constructror');
    this.configService.config.subscribe(config => {
      console.log('config', config);
      if (config) {
        this.config = config;
        if (this.init()) {
          this.getProducts();
        }
      }
    });
  }

  init() {
    this.baseUrl = this.config.API_ENDPOINT ? this.config.API_ENDPOINT : this.config.SECURE_API_ENDPOINT;
    if (!this.baseUrl) {
      return false;
    }

    return true;
  }

  getProducts() {
    if (this.baseUrl) {
      // return this.http.get<Product[]>(this.baseUrl + '/api/products');
      this.http.get<Product[]>(this.baseUrl + '/api/products')
      .subscribe(
        (products: Product[]) => {
          this._products.next(products);
        },
        error => {
          console.error('getProducts ERROR!', JSON.stringify(error));
        }
      );
    } else {
      console.error('ProductsService not ready!');
    }
  }
}
