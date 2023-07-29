import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IpServicesService } from 'src/app/services/ip-services.service';
import { inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';

declare const L: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  ipService: IpServicesService = inject(IpServicesService);
  fb: FormBuilder = inject(FormBuilder);

  imgButton = 'assets/images/icon-arrow.svg';

  map: any;

  ipAdrressForm = this.fb.nonNullable.group(
    {
      ip: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20),
      Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/),]],
    }
  );

  ngOnInit() {
    this.map = L.map('map').setView([3.43722, -76.5225], 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  async getIpAddress() {
    let ip = this.ipAdrressForm.controls.ip.value
    await this.ipService.getInfoAddress(ip)
      .pipe(
        catchError((err: any) => {
          return throwError(err);
        }),
      )
      .subscribe(res => {
        console.log(res);
        this.getCoordinates(res);
      });
  }

  async getCoordinates(data: any) {
    let dataCountry = data.location;
    await this.ipService.getCoordinates(dataCountry)
      .pipe(
        catchError((err: any) => {
          return throwError(err);
        }),
      )
      .subscribe(res => {
        this.setCoordinatesMap(res);
        console.log(res);
      });
  }

  async setCoordinatesMap(dataCountry: any){
    let coordinatesCountry = dataCountry[0];
    console.log(dataCountry[0]);
    this.map.remove();
    this.map = L.map('map').setView([coordinatesCountry.latitude, coordinatesCountry.longitude], 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

}
