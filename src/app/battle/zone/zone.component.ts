import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Zone } from "src/app/model/enemy/zone";

@Component({
  selector: "app-zone",
  templateUrl: "./zone.component.html",
  styleUrls: ["./zone.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZoneComponent implements OnInit {
  @Input() zone: Zone;

  constructor() {}

  ngOnInit() {}
}
