import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";

@Component({
  selector: "app-options-nav",
  templateUrl: "./options-nav.component.html",
  styleUrls: ["./options-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsNavComponent implements OnInit {
  @HostBinding("class")
  contentContainer = "content-container";

  constructor() {}

  ngOnInit() {}
}
