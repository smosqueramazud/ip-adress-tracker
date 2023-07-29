import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { IpRes } from '../models/ip-res';
import { Coordinates } from '../models/coordinates';

@Injectable({
  providedIn: 'root'
})
export class IpServicesService {

  http: HttpClient = inject(HttpClient);

  constructor() { }

  public getMyIpAddress(): Observable<IpRes> {
    const apiKey = 'at_eddpYnnHrWAv3TayVMNTDGCmY2rRU';
    return this.http.get<IpRes>(`https://geo.ipify.org/api/v2/country?apiKey=${apiKey}`);
  }

  public getInfoAddress(ip: string): Observable<IpRes> {
    const apiKey = 'at_eddpYnnHrWAv3TayVMNTDGCmY2rRU';
    return this.http.get<IpRes>(`https://geo.ipify.org/api/v2/country?apiKey=${apiKey}&ipAddress=${ip}`);
  }

  public getCoordinates(data: any): Observable<Coordinates[]> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('X-Api-Key', '2C6s7KUsak2YwusbgKQziQ==UOUSVP6E6DFgx9gX');
    return this.http.get<Coordinates[]>(`https://api.api-ninjas.com/v1/geocoding?city=${data.region}&country=${data.country}`,
    { 'headers': headers });
  }
}
