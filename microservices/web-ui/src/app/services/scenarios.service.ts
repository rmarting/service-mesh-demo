import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericResult } from '../model/generic-result.model';
import { ConfigService } from './config.service';
import { Config } from '../model/config.model';


@Injectable({
  providedIn: 'root'
})
export class ScenariosService {
  config: Config;
  baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    console.log('ScenariosService constructror');
    this.configService.config.subscribe(config => {
      console.log('config', config);
      if (config) {
        this.config = config;
        if (this.init()) {
          console.error('Error at ScenariosService.init()');
        }
      }
    });
  }

  init() {
    this.baseUrl = this.config.SCENARIOS_API_ENDPOINT ? this.config.SCENARIOS_API_ENDPOINT : null;
    if (!this.baseUrl) {
      return false;
    }

    return true;
  }

  runAction(uri: string) {
    return this.http.get<GenericResult>(this.baseUrl + '/' + uri);
  }
}
