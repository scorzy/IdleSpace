import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { MainService } from "../../main.service";

@Component({
  selector: "app-automators",
  templateUrl: "./automators.component.html",
  styleUrls: ["./automators.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomatorsComponent implements OnInit {
  @HostBinding("class")
  contentContainer = "content-container";

  constructor(public ms: MainService) {}

  ngOnInit() {}
}
