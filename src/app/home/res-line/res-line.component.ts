import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Resource } from "../../model/resource/resource";
import { OptionsService } from "../../options.service";

@Component({
  selector: "app-res-line",
  templateUrl: "./res-line.component.html",
  styleUrls: ["./res-line.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResLineComponent implements OnInit {
  @Input() res: Resource;
  constructor(public os: OptionsService) {}

  ngOnInit() {}
}
