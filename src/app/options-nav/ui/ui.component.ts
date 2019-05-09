import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { FormatPipe } from "src/app/format.pipe";
declare let preventScroll;

@Component({
  selector: "app-ui",
  templateUrl: "./ui.component.html",
  styleUrls: ["./ui.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiComponent implements OnInit, AfterViewInit {
  OptionsService = OptionsService;
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
