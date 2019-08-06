import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";

@Component({
  selector: "app-lab-tabs",
  templateUrl: "./lab-tabs.component.html",
  styleUrls: ["./lab-tabs.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabTabsComponent implements OnInit {
  @HostBinding("class")
  contentContainer = "content-container";

  constructor() {}

  ngOnInit() {}
}
