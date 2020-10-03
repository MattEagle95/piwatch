import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  endpoint: string = "pm2";

  constructor(private http: HttpClient, private configService: ConfigService) { }

  status(): Observable<any> {
    return this.http.get(`${this.getUrl()}/status`);
  }

  logs(name: string) {
    return this.http.get(`${this.getUrl()}/logs?name=${name}`, { responseType: 'text' });
  }

  describe(name: string) {
    return this.http.post(`${this.getUrl()}/describe`, { name: name });
  }

  start(name: string, script: string) {
    return this.http.post(`${this.getUrl()}/start`, { name: name, script: script });
  }

  flush(name: string) {
    return this.http.post(`${this.getUrl()}/flush`, { name: name });
  }

  reload(name: string) {
    return this.http.post(`${this.getUrl()}/reload`, { name: name });
  }

  restart(name: string) {
    return this.http.post(`${this.getUrl()}/restart`, { name: name });
  }

  stop(name: string) {
    return this.http.post(`${this.getUrl()}/stop`, { name: name });
  }

  private getUrl(): string {
    return `${this.configService.config.baseUrl}/${this.endpoint}`;
  }
}
