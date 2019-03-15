import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { MainService } from "src/app/main.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  @HostBinding("class")
  contentArea = "content-area";

  constructor(public ms: MainService) {}

  ngOnInit() {}

  generate() {
    this.ms.game.enemyManager.generate();
  }
}
