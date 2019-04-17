import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-shipyard-info',
  templateUrl: './shipyard-info.component.html',
  styleUrls: ['./shipyard-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipyardInfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
