import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { MainService } from "../main.service";

@Component({
  selector: "app-battle",
  templateUrl: "./battle.component.html",
  styleUrls: ["./battle.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleMenuComponent implements OnInit {
  @HostBinding("class")
  contentContainer = "content-container";
  constructor(public ms: MainService) {}

  ngOnInit() {}

  fight() {}
}
