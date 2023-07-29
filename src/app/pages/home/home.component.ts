import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IpServicesService } from 'src/app/services/ip-services.service';
import { inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { IpRes } from 'src/app/models/ip-res';
import { Coordinates } from 'src/app/models/coordinates';
import { CardInfoComponent } from './components/card-info/card-info.component';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';

declare const L: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardInfoComponent, NgxSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  ipService: IpServicesService = inject(IpServicesService);
  fb: FormBuilder = inject(FormBuilder);
  spinner: NgxSpinnerService = inject(NgxSpinnerService);

  imgButton = 'assets/images/icon-arrow.svg';

  map: any;
  infoIp: IpRes | undefined;
  myActualIp: string | undefined;

  ipAdrressForm = this.fb.nonNullable.group(
    {
      ip: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20),
      Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/),]],
    }
  );

  ngOnInit() {
    this.getMyIp();
    this.map = L.map('map').setView([3.43722, -76.5225], 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  async getIpAddress(ipNumber?: string) {
    if (ipNumber) {
      var ip = ipNumber;
    } else {
      var ip = this.ipAdrressForm.controls.ip.value
    }
    this.spinner.show();
    await this.ipService.getInfoAddress(ip)
      .pipe(
        catchError((err: any) => {
          this.spinner.hide();
          return throwError(err);
        }),
      )
      .subscribe(res => {
        this.spinner.hide();
        this.infoIp = res;
        this.getCoordinates(res);
      });
  }

  async getCoordinates(data: IpRes) {
    let dataCountry = data.location;
    await this.ipService.getCoordinates(dataCountry)
      .pipe(
        catchError((err: any) => {
          return throwError(err);
        }),
      )
      .subscribe(res => {
        this.setCoordinatesMap(res);
      });
  }

  async setCoordinatesMap(dataCountry: Coordinates[]) {
    let coordinatesCountry = dataCountry[0];
    this.map.remove();
    this.map = L.map('map').setView([coordinatesCountry.latitude, coordinatesCountry.longitude], 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    var myIcon = L.icon({
      iconUrl: 'assets/images/icon-location.svg',
      iconSize: [45, 55],
    });

    L.marker([coordinatesCountry.latitude, coordinatesCountry.longitude], {icon: myIcon}).addTo(this.map);
  }

  async getMyIp() {
    await this.ipService.getMyIpAddress()
      .pipe(
        catchError((err: any) => {
          this.spinner.hide();
          return throwError(err);
        }),
      )
      .subscribe(res => {
        this.spinner.hide();
        this.myActualIp = res.ip;
        this.getIpAddress(this.myActualIp);
      });

  }
}
