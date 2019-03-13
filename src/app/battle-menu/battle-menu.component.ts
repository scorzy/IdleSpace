import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";

@Component({
  selector: "app-battle-menu",
  templateUrl: "./battle-menu.component.html",
  styleUrls: ["./battle-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleMenuComponent implements OnInit {
  @HostBinding("class")
  contentContainer = "content-container";
  constructor() {}

  ngOnInit() {}
}
