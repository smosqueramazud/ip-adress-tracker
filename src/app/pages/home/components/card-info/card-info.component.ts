import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IpRes } from 'src/app/models/ip-res';

@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss']
})
export class CardInfoComponent {

  @Input() data: IpRes | undefined | null;
}
