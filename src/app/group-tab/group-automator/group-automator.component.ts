import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { ResourceGroup } from "src/app/model/resource/resourceGroup";
import { GroupAutomator } from "src/app/model/automators/groupAutomator";

@Component({
  selector: "app-group-automator",
  templateUrl: "./group-automator.component.html",
  styleUrls: ["./group-automator.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupAutomatorComponent implements OnInit {
  @Input() resourceGroup: ResourceGroup;
  @Input() auto: GroupAutomator;

  constructor() {}

  ngOnInit() {}
}
