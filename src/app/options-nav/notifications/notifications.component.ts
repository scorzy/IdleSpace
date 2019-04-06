import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { OptionsService } from "src/app/options.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent implements OnInit {
  @HostBinding("class")
  contentArea = "content-area";
  OptionsService = OptionsService;
  constructor(public os: OptionsService) {}

  ngOnInit() {}
}
