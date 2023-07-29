import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpServicesService {

  http: HttpClient = inject(HttpClient);

  constructor() { }

  public getInfoAddress(ip: any): Observable<any> {
    const apiKey = 'at_eddpYnnHrWAv3TayVMNTDGCmY2rRU';
    return this.http.get<any>(`https://geo.ipify.org/api/v2/country?apiKey=${apiKey}&ipAddress=${ip}`);
  }
}
