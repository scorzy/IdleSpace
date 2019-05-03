import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Automator } from "../model/automators/automator";

@Component({
  selector: "app-automator-group",
  templateUrl: "./automator-group.component.html",
  styleUrls: ["./automator-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomatorGroupComponent implements OnInit {
  @Input() autoGrp: Automator[];
  @Input() classes = "clr-col-lg-6";

  constructor() {}

  ngOnInit() {}

  autoId(index: number, auto: Automator) {
    return auto.id;
  }
}
