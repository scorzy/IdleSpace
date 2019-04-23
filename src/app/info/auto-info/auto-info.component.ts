import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-auto-info',
  templateUrl: './auto-info.component.html',
  styleUrls: ['./auto-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoInfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
