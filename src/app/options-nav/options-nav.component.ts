import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  AfterViewInit
} from "@angular/core";
declare let preventScroll;

@Component({
  selector: "app-options-nav",
  templateUrl: "./options-nav.component.html",
  styleUrls: ["./options-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsNavComponent implements OnInit, AfterViewInit {
  @HostBinding("class")
  contentContainer = "content-container";

  constructor() {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnInit() {}
}
