import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  AfterViewInit
} from "@angular/core";
import { preventScroll } from "../app.component";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoComponent implements OnInit, AfterViewInit {
  @HostBinding("class")
  contentContainer = "content-container";

  constructor() {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnInit() {}
}
