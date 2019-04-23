import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-enemy-info',
  templateUrl: './enemy-info.component.html',
  styleUrls: ['./enemy-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnemyInfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
