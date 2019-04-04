import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericResult } from '../model/generic-result.model';
import { ConfigService } from './config.service';
import { Config } from '../model/config.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenariosService {
  private config: Config;

  // tslint:disable-next-line:variable-name
  private _ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly ready: Observable<boolean> = this._ready.asObservable();

  // private baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    console.log('ScenariosService constructor');
    this.configService.config.subscribe(config => {
      console.log('config', config);
      if (config) {
        this.config = config;
        this._ready.next(true);
      }
    });
  }

  runAction(uri: string) {
    if (this.config) {
      return this.http.get<GenericResult>(this.config.SCENARIOS_API_ENDPOINT + '/' + uri);
    }
    console.error('Action not run, no baseUrl available...');
  }
}
