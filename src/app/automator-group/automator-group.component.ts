import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { AutomatorGroup } from "../model/automators/automatorGroup";

@Component({
  selector: "app-automator-group",
  templateUrl: "./automator-group.component.html",
  styleUrls: ["./automator-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomatorGroupComponent implements OnInit {
  @Input() autoGrp: AutomatorGroup;

  constructor() {}

  ngOnInit() {}
}
