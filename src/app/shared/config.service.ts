import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _config: any;

  constructor(private http: HttpClient) { }

  loadConfig() {
    return this.http.get('/assets/config.json')
      .toPromise()
      .then(data => {
        this._config = data;
      });
  }

  get config() {

    if (!this._config) {
      throw Error('Config file not loaded!');
    }

    return this._config;
  }
}