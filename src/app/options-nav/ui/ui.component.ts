import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { FormatPipe } from "src/app/format.pipe";

@Component({
  selector: "app-ui",
  templateUrl: "./ui.component.html",
  styleUrls: ["./ui.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiComponent implements OnInit {
  @HostBinding("class")
  contentArea = "content-area";

  constructor(public ms: MainService, public os: OptionsService) {
    //
  }

  ngOnInit() {}
  onFormatChange() {
    FormatPipe.map.clear();
    this.os.generateFormatter();
  }
}
