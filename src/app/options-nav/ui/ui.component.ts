import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  AfterViewInit
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { FormatPipe } from "src/app/format.pipe";
import { preventScroll } from "src/app/app.component";

@Component({
  selector: "app-ui",
  templateUrl: "./ui.component.html",
  styleUrls: ["./ui.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiComponent implements OnInit, AfterViewInit {
  constructor(public ms: MainService, public os: OptionsService) {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnInit() {}
  onFormatChange() {
    FormatPipe.map.clear();
    this.os.generateFormatter();
  }
}
